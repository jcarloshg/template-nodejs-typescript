import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent, MessageCreatedDomainEventPrimitives } from "../../domain/domain-event/message-created.domain-event";
import { MessageCreatedKafkaConsumer } from "../../infra/kafka/init-kafka";

export class NotifyEventHandler implements EventHandler<MessageCreatedDomainEventPrimitives> {

    private _consumer: MessageCreatedKafkaConsumer;
    private static _instance: NotifyEventHandler;

    constructor() {
        this._consumer = new MessageCreatedKafkaConsumer(this.handle);
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
        console.log("send through kafka or other transport layer");
    }

}