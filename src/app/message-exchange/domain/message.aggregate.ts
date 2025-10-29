import { AggregateRoot } from "@/app/shared/domain/domain-event/aggregate-root";
import { Message } from "./message.entity";

export class MessageAggregate extends AggregateRoot {

    private _message: Message | null = null;

    constructor() {
        super();
    }

    public createMessage(data: { [key: string]: any }): void {
        this._message = new Message(data);
    }

}
