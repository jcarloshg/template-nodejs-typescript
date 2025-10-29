import { EventBody, EventName, SocketIO } from "./socket";

export interface ChatMessagePayload {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

export interface ChatMessageEventBody extends EventBody {
    payload: ChatMessagePayload;
}

export class ChatMessageSocket {

    public static readonly eventName: EventName = 'chat-message';
    private static instance: ChatMessageSocket;

    private socketIO: SocketIO;

    constructor(socketIO: SocketIO) {
        this.socketIO = socketIO;
        ChatMessageSocket.instance = this;
    }

    public static async emitChatMessage(ChatMessagePayload: ChatMessagePayload): Promise<void> {
        if (!ChatMessageSocket.instance) {
            throw new Error("ChatMessageSocket instance not initialized.");
        }
        const eventBody: ChatMessageEventBody = {
            eventUuid: crypto.randomUUID(),
            timestamp: new Date(),
            payload: ChatMessagePayload
        };
        await ChatMessageSocket
            .instance
            .socketIO
            .emit(ChatMessageSocket.eventName, eventBody);
    }
}