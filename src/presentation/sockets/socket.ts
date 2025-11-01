import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export type EventName = string;
export interface EventBody {
    payload: any;
};

export class SocketIO {
    private io: Server;
    private static instance: SocketIO;

    constructor(httpServer: HttpServer) {
        this.io = new Server(
            httpServer,
            {
                connectionStateRecovery: {}
            }
        );
        this.initialize();
        SocketIO.instance = this;
    }

    private initialize() {
        this.io.on("connection", (socket) => {
            console.log(`New client connected: ${socket.id}`);
            socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
        });
    }

    public async emit(eventName: EventName, eventBody: EventBody): Promise<void> {
        try {
            if (!SocketIO.instance) {
                throw new Error("Socket.IO instance not initialized.");
            }
            SocketIO.instance.io.emit(eventName, JSON.stringify(eventBody));
        } catch (error) {
            console.error("Error emitting socket event:", error);
        }
    }

}