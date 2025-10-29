import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent } from "../../domain/domain-event/message-created.domain-event";

export class NotifyEventHandler implements EventHandler<MessageCreatedDomainEvent> {

    constructor() { }

    public subscribeTo(): string {
        return MessageCreatedDomainEvent.eventName;
    }

    async handle(event: MessageCreatedDomainEvent): Promise<void> {
        console.log("send through kafka or other transport layer");
    }

}