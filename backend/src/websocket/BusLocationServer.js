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

            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Unknown message type'
                }));
        }
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

        const subscribedParents = this.parentConnections.get(assignment_id) || new Set();

        subscribedParents.forEach((parentWs) => {
            if (parentWs.readyState === WebSocket.OPEN) {
                parentWs.send(JSON.stringify({
                    type: 'bus:location',
                    payload: locationData
                }));
            }
        });

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