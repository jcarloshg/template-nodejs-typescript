import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent, MessageCreatedDomainEventPrimitives } from "../../domain/domain-event/message-created.domain-event";
import { MessageCreatedKafkaConsumer } from "../../infra/kafka/init-kafka";

export class NotifyEventHandler implements EventHandler<MessageCreatedDomainEventPrimitives> {

    private _consumer: MessageCreatedKafkaConsumer;
    private static _instance: NotifyEventHandler;

    constructor() {
        this._consumer = new MessageCreatedKafkaConsumer(
            'notify-event-handler',
            this.handle
        );
    }

    public static async getInstance(): Promise<NotifyEventHandler> {
        if (!this._instance) {
            this._instance = new NotifyEventHandler();
            await this._instance._consumer.init();
        }
        return this._instance;
    }

    public subscribeTo(): string {
        return MessageCreatedDomainEvent.eventName;
    }

    async handle(event: MessageCreatedDomainEventPrimitives): Promise<void> {
        try {
            // console.log(`New message received from ${event.data.senderId}: ${event.data.content}`);
            // const notification = `You have a new message from [${event.data.senderId}]: "${event.data.content}"`;
            // console.log(`[NotifyEventHandler] - notification: `, notification);
            console.log(`[${event.data.senderId}]: ${event.data.content}"` );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[NotifyEventHandler] - error: `, errorMessage);
        }
    }

}