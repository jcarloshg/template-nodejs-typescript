import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent, MessageCreatedDomainEventPrimitives } from "../../domain/domain-event/message-created.domain-event";
import { MessageCrudRepository } from "@/app/shared/domain/repository/messgae.crud-repository";
import { MessageCreatedKafkaConsumer } from "@/app/message-exchange/infra/kafka/init-kafka";

export class SaveInRepoEventHandler implements EventHandler<MessageCreatedDomainEventPrimitives> {

    private _consumer: MessageCreatedKafkaConsumer;
    private static _instance: SaveInRepoEventHandler;

    constructor(
        private readonly repository: MessageCrudRepository
    ) {
        this._consumer = new MessageCreatedKafkaConsumer(
            'save-in-repo-event-handler',
            this.handle.bind(this)
        );
    }

    public static async getInstance(repository: MessageCrudRepository): Promise<SaveInRepoEventHandler> {
        if (!this._instance) {
            this._instance = new SaveInRepoEventHandler(repository);
            await this._instance._consumer.init();
        }
        return this._instance;
    }

    public subscribeTo(): string {
        return MessageCreatedDomainEvent.eventName;
    }

    async handle(event: MessageCreatedDomainEventPrimitives): Promise<void> {
        await this.repository.create({
            id: event.data.messageId,
            senderId: event.data.senderId,
            content: event.data.content,
            timestamp: new Date(event.data.timestamp),
        });
    }

}