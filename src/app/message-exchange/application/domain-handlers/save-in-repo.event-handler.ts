import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent } from "../../domain/domain-event/message-created.domain-event";
import { MessageCrudRepository } from "@/app/shared/domain/repository/messgae.crud-repository";

export class SaveInRepoEventHandler implements EventHandler<MessageCreatedDomainEvent> {

    constructor(
        private readonly repository: MessageCrudRepository
    ) { }

    public subscribeTo(): string {
        return MessageCreatedDomainEvent.eventName;
    }

    async handle(event: MessageCreatedDomainEvent): Promise<void> {
        const props = event.props;
        await this.repository.create({
            id: props.messageId,
            senderId: props.senderId,
            content: props.content,
            timestamp: new Date(props.timestamp)
        });
    }

}