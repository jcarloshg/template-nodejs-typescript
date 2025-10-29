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

export class ChatMessageController {

    public static readonly eventName: EventName = 'chat-message';
    private static instance: ChatMessageController;

    private socketIO: SocketIO;

    constructor(socketIO: SocketIO) {
        this.socketIO = socketIO;
        ChatMessageController.instance = this;
    }

    public static async emitChatMessage(ChatMessagePayload: ChatMessagePayload): Promise<void> {
        if (!ChatMessageController.instance) {
            throw new Error("ChatMessageSocket instance not initialized.");
        }
        const eventBody: ChatMessageEventBody = {
            eventUuid: crypto.randomUUID(),
            timestamp: new Date(),
            payload: ChatMessagePayload
        };
        await ChatMessageController
            .instance
            .socketIO
            .emit(ChatMessageController.eventName, eventBody);
    }
}