import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent, MessageCreatedDomainEventPrimitives } from "../../domain/domain-event/message-created.domain-event";
import { MessageCrudRepository } from "@/app/shared/domain/repository/messgae.crud-repository";

export class SaveInRepoEventHandler implements EventHandler<MessageCreatedDomainEventPrimitives> {

    constructor(
        private readonly repository: MessageCrudRepository
    ) { }

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