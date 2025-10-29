import { DomainEvent } from "@/app/shared/domain/domain-event/domain-event";

export interface MessageCreatedDomainEventProps {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export class MessageCreatedDomainEvent extends DomainEvent {
    public static readonly eventName: string = "message.created";
    public readonly props: MessageCreatedDomainEventProps;

    constructor(props: MessageCreatedDomainEventProps) {
        super();
        this.props = props;
    }

    public toPrimitives(): Record<string, any> {
        return {
            metadata: this.getMetadata(),
            data: {
                messageId: this.props.messageId,
                senderId: this.props.senderId,
                content: this.props.content,
                timestamp: this.props.timestamp,
            }
        };
    }
}
