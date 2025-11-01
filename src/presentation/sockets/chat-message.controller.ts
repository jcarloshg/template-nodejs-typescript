import { EventName, SocketIO } from "./socket";

export interface ChatMessagePayload {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

export interface ChatMessageEventBody {
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

    public static initialize(socketIO: SocketIO): void {
        if (!ChatMessageController.instance) {
            ChatMessageController.instance = new ChatMessageController(socketIO);
        }
    }

    public static getInstance(): ChatMessageController {
        if (!ChatMessageController.instance) {
            throw new Error("ChatMessageController not initialized.");
        }
        return ChatMessageController.instance;
    }

    public async emitChatMessage(chatMessagePayload: ChatMessagePayload): Promise<void> {

        if (!ChatMessageController.instance) {
            throw new Error("ChatMessageSocket instance not initialized.");
        }

        const eventBody: ChatMessageEventBody = {
            payload: chatMessagePayload
        };

        await ChatMessageController
            .instance
            .socketIO
            // change ChatMessageController.eventName for id chat room
            .emit(ChatMessageController.eventName, eventBody);
    }
}