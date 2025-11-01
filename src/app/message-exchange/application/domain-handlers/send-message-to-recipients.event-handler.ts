import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent, MessageCreatedDomainEventPrimitives } from "../../domain/domain-event/message-created.domain-event";
import { ChatMessageController, ChatMessagePayload } from "@/presentation/sockets/chat-message.controller";
import { MessageCreatedKafkaConsumer } from "../../infra/kafka/init-kafka";

export class SendMessageToRecipientsEventHandler implements EventHandler<MessageCreatedDomainEventPrimitives> {

    private _consumer: MessageCreatedKafkaConsumer;
    private static _instance: SendMessageToRecipientsEventHandler;

    constructor() {
        this._consumer = new MessageCreatedKafkaConsumer(this.handle);
    }

    public subscribeTo(): string {
        return MessageCreatedDomainEvent.name;
    }

    public static async getInstance(): Promise<SendMessageToRecipientsEventHandler> {
        if (!this._instance) {
            this._instance = new SendMessageToRecipientsEventHandler();
            await this._instance._consumer.init();
            this._instance._consumer.setHandler(this._instance.handle);
        }
        return SendMessageToRecipientsEventHandler._instance;
    }

    async handle(event: MessageCreatedDomainEventPrimitives): Promise<void> {
        try {
            const chatMessagePayload: ChatMessagePayload = {
                messageId: event.data.messageId,
                senderId: event.data.senderId,
                content: event.data.content,
                timestamp: new Date(event.data.timestamp)
            };
            await ChatMessageController
                .getInstance()
                .emitChatMessage(chatMessagePayload);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log(`[SendMessageToRecipientsEventHandler] - [ERROR] ${errorMessage}`);
        }
    }
}