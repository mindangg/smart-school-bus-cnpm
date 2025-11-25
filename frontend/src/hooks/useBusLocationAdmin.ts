// hooks/useBusLocationAdmin.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface BusLocation {
    assignment_id: number;
    latitude: number;
    longitude: number;
    timestamp: number;
    tracking_mode?: string;
}

interface UseBusLocationAdminProps {
    assignment_id: number;
    admin_id: number;
    enabled?: boolean;
}

interface AdminBusData {
    assignment_id: number;
    bus_locations: Map<number, BusLocation>;
    driver_connections: number[];
    parent_subscriptions: Map<number, number[]>;
    tracking_modes: Map<number, string>;
}

export const useBusLocationAdmin = ({
                                        assignment_id,
                                        admin_id,
                                        enabled = true
                                    }: UseBusLocationAdminProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
    const [trackingMode, setTrackingMode] = useState<'gps' | 'simulation'>('simulation');
    const [allBusLocations, setAllBusLocations] = useState<Map<number, BusLocation>>(new Map());
    const [driverConnections, setDriverConnections] = useState<number[]>([]);
    const [parentSubscriptions, setParentSubscriptions] = useState<Map<number, number[]>>(new Map());
    const [trackingModes, setTrackingModes] = useState<Map<number, string>>(new Map());

    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;

    const connect = useCallback(() => {
        if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket('ws://localhost:4000/ws/bus-location');

            ws.onopen = () => {
                console.log('Admin WebSocket connected');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;

                ws.send(JSON.stringify({
                    type: 'admin:register',
                    payload: {
                        admin_id,
                        assignment_id
                    }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Admin received:', data);

                    switch (data.type) {
                        case 'admin:registered':
                            console.log('Admin registered successfully');
                            break;

                        case 'admin:system_status':
                            // Xử lý system status...
                            break;

                        case 'bus:location': // QUAN TRỌNG: Xử lý cập nhật vị trí
                            const locationData: BusLocation = data.payload;
                            console.log('Admin received bus location update:', locationData);

                            // Cập nhật allBusLocations
                            setAllBusLocations(prev => {
                                const newMap = new Map(prev);
                                newMap.set(locationData.assignment_id, locationData);
                                return newMap;
                            });

                            // QUAN TRỌNG: Cập nhật vị trí hiện tại nếu là assignment đang theo dõi
                            if (locationData.assignment_id === assignment_id) {
                                console.log('Updating current bus location:', locationData);
                                setBusLocation(locationData);
                                setTrackingMode(locationData.tracking_mode as 'gps' | 'simulation' || 'simulation');
                            }
                            break;

                        case 'bus:tracking_mode':
                            // Cập nhật chế độ theo dõi
                            const trackingData = data.payload;

                            setTrackingModes(prev => {
                                const newMap = new Map(prev);
                                newMap.set(trackingData.assignment_id, trackingData.tracking_mode);
                                return newMap;
                            });

                            if (trackingData.assignment_id === assignment_id) {
                                setTrackingMode(trackingData.tracking_mode);
                            }
                            break;

                        case 'driver:connected':
                            // Driver mới kết nối
                            const driverData = data.payload;
                            setDriverConnections(prev => [...prev, driverData.assignment_id]);
                            break;

                        case 'driver:disconnected':
                            // Driver ngắt kết nối
                            const disconnectedDriver = data.payload;
                            setDriverConnections(prev => prev.filter(id => id !== disconnectedDriver.assignment_id));
                            break;

                        case 'parent:subscribed':
                            // Parent mới subscribe
                            const parentSubData = data.payload;
                            setParentSubscriptions(prev => {
                                const newMap = new Map(prev);
                                const currentSubs = newMap.get(parentSubData.assignment_id) || [];
                                if (!currentSubs.includes(parentSubData.parent_id)) {
                                    newMap.set(parentSubData.assignment_id, [...currentSubs, parentSubData.parent_id]);
                                }
                                return newMap;
                            });
                            break;

                        case 'parent:unsubscribed':
                            // Parent unsubscribe
                            const parentUnsubData = data.payload;
                            setParentSubscriptions(prev => {
                                const newMap = new Map(prev);
                                const currentSubs = newMap.get(parentUnsubData.assignment_id) || [];
                                const updatedSubs = currentSubs.filter(id => id !== parentUnsubData.parent_id);

                                if (updatedSubs.length === 0) {
                                    newMap.delete(parentUnsubData.assignment_id);
                                } else {
                                    newMap.set(parentUnsubData.assignment_id, updatedSubs);
                                }

                                return newMap;
                            });
                            break;

                        case 'error':
                            console.error('WebSocket error:', data.message);
                            break;

                        default:
                            console.warn('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('Admin WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('Admin WebSocket closed');
                setIsConnected(false);
                wsRef.current = null;

                if (enabled && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
                    reconnectAttemptsRef.current++;

                    console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
        }
    }, [assignment_id, admin_id, enabled]);

    // Gửi lệnh đến server
    const sendCommand = useCallback((command: string, data?: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: `admin:${command}`,
                payload: {
                    admin_id,
                    assignment_id,
                    ...data
                }
            }));
        }
    }, [assignment_id, admin_id]);

    // Lấy thống kê hệ thống
    const getSystemStats = useCallback(() => {
        sendCommand('get_system_status');
    }, [sendCommand]);

    // Gửi thông báo đến driver
    const sendDriverNotification = useCallback((driverAssignmentId: number, message: string) => {
        sendCommand('notify_driver', {
            target_assignment_id: driverAssignmentId,
            message
        });
    }, [sendCommand]);

    // Gửi thông báo đến parents
    const sendParentNotification = useCallback((message: string) => {
        sendCommand('notify_parents', {
            message
        });
    }, [sendCommand]);

    // Yêu cầu driver chuyển chế độ theo dõi
    const requestTrackingModeChange = useCallback((newMode: 'gps' | 'simulation') => {
        sendCommand('change_tracking_mode', {
            tracking_mode: newMode
        });
    }, [sendCommand]);

    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'admin:unregister',
                    payload: { admin_id, assignment_id }
                }));
            }

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [enabled, connect, assignment_id, admin_id]);

    // Tính toán số lượng parent đang theo dõi assignment hiện tại
    const currentParentSubscribers = parentSubscriptions.get(assignment_id)?.length || 0;

    // Lấy tất cả assignment đang hoạt động
    const activeAssignments = Array.from(allBusLocations.keys());

    return {
        isConnected,
        busLocation,
        trackingMode,
        allBusLocations,
        driverConnections,
        parentSubscriptions,
        trackingModes,
        currentParentSubscribers,
        activeAssignments,
        sendCommand,
        getSystemStats,
        sendDriverNotification,
        sendParentNotification,
        requestTrackingModeChange
    };
};