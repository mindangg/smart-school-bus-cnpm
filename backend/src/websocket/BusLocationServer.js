const WebSocket = require('ws');

class BusLocationServer {
    constructor(server) {
        this.wss = new WebSocket.Server({
            server,
            path: '/ws/bus-location'
        });

        this.busLocations = new Map();

        this.driverConnections = new Map();
        this.parentConnections = new Map();

        this.driverTrackingModes = new Map();

        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            console.log('New WebSocket connection established');

            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Invalid message format'
                    }));
                }
            });

            ws.on('close', () => {
                console.log('WebSocket connection closed');
                this.handleDisconnect(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });

        const interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    this.handleDisconnect(ws);
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping();
            });
        }, 30000); // 30 giây

        this.wss.on('close', () => {
            clearInterval(interval);
        });
    }


    handleMessage(ws, data) {
        const { type, payload } = data;

        switch (type) {
            case 'driver:register':
                this.registerDriver(ws, payload);
                break;

            case 'driver:location':
                this.updateBusLocation(ws, payload);
                break;

            case 'driver:tracking_mode':
                this.updateDriverTrackingMode(ws, payload);
                break;

            case 'parent:subscribe':
                this.subscribeParent(ws, payload);
                break;

            case 'parent:unsubscribe':
                this.unsubscribeParent(ws, payload);
                break;

            // Thêm handler cho admin
            case 'admin:register':
                this.registerAdmin(ws, payload);
                break;

            case 'admin:get_system_status':
                this.sendSystemStatus(ws, payload);
                break;

            case 'admin:notify_driver':
                this.sendDriverNotification(ws, payload);
                break;

            case 'admin:notify_parents':
                this.sendParentNotification(ws, payload);
                break;

            case 'admin:change_tracking_mode':
                this.changeDriverTrackingMode(ws, payload);
                break;

            case 'admin:unregister':
                this.unregisterAdmin(ws, payload);
                break;

            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Unknown message type'
                }));
        }
    }

    // Đăng ký admin
    registerAdmin(ws, payload) {
        const { admin_id, assignment_id } = payload;

        if (!admin_id) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing admin_id'
            }));
            return;
        }

        ws.role = 'admin';
        ws.admin_id = admin_id;
        ws.assignment_id = assignment_id;

        console.log(`Admin ${admin_id} registered`);

        ws.send(JSON.stringify({
            type: 'admin:registered',
            payload: { admin_id, assignment_id }
        }));

        // Gửi ngay trạng thái hệ thống hiện tại
        this.sendSystemStatus(ws, payload);
    }

    // Gửi trạng thái hệ thống cho admin
    sendSystemStatus(ws, payload) {
        const systemStatus = {
            bus_locations: Object.fromEntries(this.busLocations),
            driver_connections: Array.from(this.driverConnections.keys()),
            parent_subscriptions: Object.fromEntries(
                Array.from(this.parentConnections.entries()).map(([key, value]) => [
                    key,
                    Array.from(value).map(ws => ws.parent_id).filter(Boolean)
                ])
            ),
            tracking_modes: Object.fromEntries(this.driverTrackingModes)
        };

        ws.send(JSON.stringify({
            type: 'admin:system_status',
            payload: systemStatus
        }));
    }

    // Gửi thông báo đến driver
    sendDriverNotification(ws, payload) {
        const { target_assignment_id, message } = payload;
        const driverWs = this.driverConnections.get(target_assignment_id);

        if (driverWs && driverWs.readyState === WebSocket.OPEN) {
            driverWs.send(JSON.stringify({
                type: 'admin:notification',
                payload: {
                    message,
                    timestamp: Date.now(),
                    from_admin: ws.admin_id
                }
            }));
        }
    }

    // Gửi thông báo đến tất cả parents của một assignment
    sendParentNotification(ws, payload) {
        const { assignment_id, message } = payload;
        const subscribers = this.parentConnections.get(assignment_id) || new Set();

        subscribers.forEach(parentWs => {
            if (parentWs.readyState === WebSocket.OPEN) {
                parentWs.send(JSON.stringify({
                    type: 'admin:notification',
                    payload: {
                        message,
                        timestamp: Date.now(),
                        from_admin: ws.admin_id
                    }
                }));
            }
        });
    }

    // Thay đổi chế độ theo dõi của driver
    changeDriverTrackingMode(ws, payload) {
        const { assignment_id, tracking_mode } = payload;
        const driverWs = this.driverConnections.get(assignment_id);

        if (driverWs && driverWs.readyState === WebSocket.OPEN) {
            driverWs.send(JSON.stringify({
                type: 'admin:change_tracking_mode',
                payload: {
                    tracking_mode,
                    timestamp: Date.now()
                }
            }));
        }
    }

    // Hủy đăng ký admin
    unregisterAdmin(ws, payload) {
        console.log(`Admin ${ws.admin_id} unregistered`);
        // Cleanup sẽ được xử lý trong handleDisconnect
    }

    // Cập nhật handleDisconnect để xử lý admin
    handleDisconnect(ws) {
        if (ws.role === 'driver' && ws.assignment_id) {
            this.driverConnections.delete(ws.assignment_id);
            this.driverTrackingModes.delete(ws.assignment_id);
            console.log(`Driver disconnected from assignment ${ws.assignment_id}`);

            // Thông báo cho admin về driver disconnect
            this.broadcastToAdmins('driver:disconnected', {
                assignment_id: ws.assignment_id,
                timestamp: Date.now()
            });

        } else if (ws.role === 'parent') {
            this.parentConnections.forEach((subscribers, assignment_id) => {
                subscribers.delete(ws);
                if (subscribers.size === 0) {
                    this.parentConnections.delete(assignment_id);
                }
            });
            console.log('Parent disconnected');

        } else if (ws.role === 'admin') {
            console.log(`Admin ${ws.admin_id} disconnected`);
        }
    }

    // Broadcast đến tất cả admin
    broadcastToAdmins(type, payload) {
        this.wss.clients.forEach((client) => {
            if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type,
                    payload
                }));
            }
        });
    }


    registerDriver(ws, payload) {
        const { assignment_id, driver_id, tracking_mode = 'simulation' } = payload;

        if (!assignment_id || !driver_id) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing assignment_id or driver_id'
            }));
            return;
        }

        ws.role = 'driver';
        ws.assignment_id = assignment_id;
        ws.driver_id = driver_id;

        this.driverConnections.set(assignment_id, ws);

        this.driverTrackingModes.set(assignment_id, tracking_mode);

        console.log(`Driver ${driver_id} registered for assignment ${assignment_id} with mode: ${tracking_mode}`);

        ws.send(JSON.stringify({
            type: 'driver:registered',
            payload: { assignment_id, driver_id, tracking_mode }
        }));

        this.broadcastTrackingMode(assignment_id, tracking_mode);

        this.broadcastToAdmins('driver:connected', {
            assignment_id,
            driver_id,
            tracking_mode,
            timestamp: Date.now()
        });
    }

    updateDriverTrackingMode(ws, payload) {
        const { assignment_id, tracking_mode } = payload;

        if (!assignment_id || !tracking_mode) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing assignment_id or tracking_mode'
            }));
            return;
        }

        this.driverTrackingModes.set(assignment_id, tracking_mode);
        console.log(`Driver updated tracking mode for assignment ${assignment_id}: ${tracking_mode}`);

        this.broadcastTrackingMode(assignment_id, tracking_mode);
    }

    broadcastTrackingMode(assignment_id, tracking_mode) {
        const subscribedParents = this.parentConnections.get(assignment_id) || new Set();

        subscribedParents.forEach((parentWs) => {
            if (parentWs.readyState === WebSocket.OPEN) {
                parentWs.send(JSON.stringify({
                    type: 'bus:tracking_mode',
                    payload: {
                        assignment_id,
                        tracking_mode,
                        timestamp: Date.now()
                    }
                }));
            }
        });
    }

    updateBusLocation(ws, payload) {
        const { assignment_id, latitude, longitude, timestamp, tracking_mode } = payload;

        if (!assignment_id || !latitude || !longitude) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing required location data'
            }));
            return;
        }

        if (tracking_mode) {
            this.driverTrackingModes.set(assignment_id, tracking_mode);
        }

        const locationData = {
            assignment_id,
            latitude,
            longitude,
            timestamp: timestamp || Date.now(),
            tracking_mode: tracking_mode || this.driverTrackingModes.get(assignment_id) || 'simulation'
        };

        this.busLocations.set(assignment_id, locationData);

        // 1. Broadcast đến parents đã subscribe
        const subscribedParents = this.parentConnections.get(assignment_id) || new Set();
        subscribedParents.forEach((parentWs) => {
            if (parentWs.readyState === WebSocket.OPEN) {
                parentWs.send(JSON.stringify({
                    type: 'bus:location',
                    payload: locationData
                }));
            }
        });

        // 2. Broadcast đến TẤT CẢ admin (quan trọng!)
        this.broadcastToAdmins('bus:location', locationData);

        console.log(`Location updated for assignment ${assignment_id}: [${latitude}, ${longitude}] mode: ${locationData.tracking_mode}`);
    }

    subscribeParent(ws, payload) {
        const { assignment_id, parent_id } = payload;

        if (!assignment_id || !parent_id) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Missing assignment_id or parent_id'
            }));
            return;
        }

        ws.role = 'parent';
        ws.parent_id = parent_id;

        if (!this.parentConnections.has(assignment_id)) {
            this.parentConnections.set(assignment_id, new Set());
        }

        const subscribers = this.parentConnections.get(assignment_id);
        subscribers.add(ws);

        console.log(`Parent ${parent_id} subscribed to assignment ${assignment_id}`);

        const currentTrackingMode = this.driverTrackingModes.get(assignment_id);
        if (currentTrackingMode) {
            ws.send(JSON.stringify({
                type: 'bus:tracking_mode',
                payload: {
                    assignment_id,
                    tracking_mode: currentTrackingMode,
                    timestamp: Date.now()
                }
            }));
        }

        const currentLocation = this.busLocations.get(assignment_id);
        if (currentLocation) {
            ws.send(JSON.stringify({
                type: 'bus:location',
                payload: currentLocation
            }));
        }

        this.broadcastToAdmins('parent:subscribed', {
            assignment_id,
            parent_id,
            timestamp: Date.now()
        });

        ws.send(JSON.stringify({
            type: 'parent:subscribed',
            payload: { assignment_id }
        }));
    }

    unsubscribeParent(ws, payload) {
        const { assignment_id } = payload;

        if (!assignment_id) {
            return;
        }

        const subscribers = this.parentConnections.get(assignment_id);
        if (subscribers) {
            subscribers.delete(ws);

            if (subscribers.size === 0) {
                this.parentConnections.delete(assignment_id);
            }
        }

        this.broadcastToAdmins('parent:unsubscribed', {
            assignment_id,
            parent_id: ws.parent_id,
            timestamp: Date.now()
        });

        console.log(`Parent unsubscribed from assignment ${assignment_id}`);
    }

    handleDisconnect(ws) {
        if (ws.role === 'driver' && ws.assignment_id) {
            this.driverConnections.delete(ws.assignment_id);
            this.driverTrackingModes.delete(ws.assignment_id);
            console.log(`Driver disconnected from assignment ${ws.assignment_id}`);
        } else if (ws.role === 'parent') {
            this.parentConnections.forEach((subscribers, assignment_id) => {
                subscribers.delete(ws);
                if (subscribers.size === 0) {
                    this.parentConnections.delete(assignment_id);
                }
            });
            console.log('Parent disconnected');
        }
    }

    getCurrentLocation(assignment_id) {
        return this.busLocations.get(assignment_id) || null;
    }
}

module.exports = BusLocationServer;