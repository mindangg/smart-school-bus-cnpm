import { useEffect, useRef, useState, useCallback } from 'react';

interface BusLocation {
    assignment_id: number;
    latitude: number;
    longitude: number;
    timestamp: number;
    tracking_mode?: string;
}

interface UseBusLocationDriverProps {
    assignment_id: number;
    driver_id: number;
    enabled?: boolean;
    initialTrackingMode?: 'gps' | 'simulation';
}

interface UseBusLocationParentProps {
    assignment_id: number;
    parent_id: number;
    enabled?: boolean;
}

export const useBusLocationDriver = ({
                                         assignment_id,
                                         driver_id,
                                         enabled = true,
                                         initialTrackingMode = 'simulation'
                                     }: UseBusLocationDriverProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [trackingMode, setTrackingMode] = useState<'gps' | 'simulation'>(initialTrackingMode);
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
                console.log('Driver WebSocket connected');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;

                // Đăng ký driver với tracking mode
                ws.send(JSON.stringify({
                    type: 'driver:register',
                    payload: {
                        assignment_id,
                        driver_id,
                        tracking_mode: trackingMode
                    }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Driver received:', data);

                    if (data.type === 'error') {
                        console.error('WebSocket error:', data.message);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('Driver WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('Driver WebSocket closed');
                setIsConnected(false);
                wsRef.current = null;

                // Thử kết nối lại
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
    }, [assignment_id, driver_id, enabled, trackingMode]);

    const sendLocation = useCallback((latitude: number, longitude: number) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'driver:location',
                payload: {
                    assignment_id,
                    latitude,
                    longitude,
                    timestamp: Date.now(),
                    tracking_mode: trackingMode
                }
            }));
        }
    }, [assignment_id, trackingMode]);

    const updateTrackingMode = useCallback((newMode: 'gps' | 'simulation') => {
        setTrackingMode(newMode);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'driver:tracking_mode',
                payload: {
                    assignment_id,
                    tracking_mode: newMode
                }
            }));
        }
    }, [assignment_id]);

    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [enabled, connect]);

    return { isConnected, sendLocation, trackingMode, updateTrackingMode };
};

// Hook cho Parent - nhận vị trí
export const useBusLocationParent = ({
                                         assignment_id,
                                         parent_id,
                                         enabled = true
                                     }: UseBusLocationParentProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
    const [trackingMode, setTrackingMode] = useState<'gps' | 'simulation'>('simulation');
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
                console.log('Parent WebSocket connected');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;

                // Subscribe to bus location
                ws.send(JSON.stringify({
                    type: 'parent:subscribe',
                    payload: {
                        assignment_id,
                        parent_id
                    }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Parent received:', data);

                    if (data.type === 'bus:location') {
                        setBusLocation(data.payload);
                    } else if (data.type === 'bus:tracking_mode') {
                        setTrackingMode(data.payload.tracking_mode);
                    } else if (data.type === 'error') {
                        console.error('WebSocket error:', data.message);
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('Parent WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('Parent WebSocket closed');
                setIsConnected(false);
                wsRef.current = null;

                // Thử kết nối lại
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
    }, [assignment_id, parent_id, enabled]);

    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            // Unsubscribe trước khi đóng
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: 'parent:unsubscribe',
                    payload: { assignment_id }
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
    }, [enabled, connect, assignment_id]);

    return { isConnected, busLocation, trackingMode };
};