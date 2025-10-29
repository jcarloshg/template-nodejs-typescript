import { AggregateRoot } from "@/app/shared/domain/domain-event/aggregate-root";
import { Message, MessageProps } from "./message.entity";
import { MessageCreatedDomainEvent } from "../domain-event/message-created.domain-event";

export class MessageAggregate extends AggregateRoot {

    private _message: Message | null = null;

    constructor() {
        super();
    }

    public createMessage(data: { [key: string]: any }): void {
        this._message = new Message(data);
        const messageProps = this._message.props;
        const messageCreatedDomainEvent = new MessageCreatedDomainEvent({
            messageId: messageProps.messageId,
            senderId: messageProps.senderId,
            content: messageProps.content,
            timestamp: messageProps.timestamp,
        });
        this.recordDomainEvent(messageCreatedDomainEvent);
    }

    public getEntityProps(): MessageProps | undefined {
        if (!this._message) return undefined;
        return this._message.props;
    }

}
