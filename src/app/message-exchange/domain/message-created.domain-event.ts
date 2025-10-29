import { DomainEvent } from "@/app/shared/domain/domain-event/domain-event";


export interface MessageCreatedDomainEventProps {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string
}

export class MessageCreatedDomainEvent extends DomainEvent {

    public static readonly eventName: string = 'message.created';
    public readonly props: MessageCreatedDomainEventProps;

    constructor(props: MessageCreatedDomainEventProps) {
        super();
        this.props = props;
    }

}