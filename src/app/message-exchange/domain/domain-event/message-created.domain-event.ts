import { DomainEvent, DomainEventPrimitives } from "@/app/shared/domain/domain-event/domain-event";

export interface MessageCreatedDomainEventProps {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export class MessageCreatedDomainEvent extends DomainEvent {
    public static readonly eventName: string = "message.created";
    public readonly props: MessageCreatedDomainEventProps;

    constructor(
        props: MessageCreatedDomainEventProps,
        aggregateId?: string
    ) {
        super(aggregateId);
        this.props = props;
    }

    public toPrimitives(): Record<string, any> {
        const primitives: MessageCreatedDomainEventPrimitives = {
            eventName: MessageCreatedDomainEvent.eventName,
            eventUuid: this.eventUuid,
            occurredOn: this.occurredOn.toISOString(),
            aggregateId: this.aggregateId,
            data: {
                messageId: this.props.messageId,
                senderId: this.props.senderId,
                content: this.props.content,
                timestamp: this.props.timestamp,
            }
        };
        return primitives;
    }
}


export interface MessageCreatedDomainEventPrimitives extends DomainEventPrimitives {
    data: {
        messageId: string;
        senderId: string;
        content: string;
        timestamp: string;
    };
}