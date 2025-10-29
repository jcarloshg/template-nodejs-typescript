import { EventPublisher } from "@/app/shared/domain/domain-event/event-publisher";
import { MessageAggregate } from "./entity/message.aggregate";
import { MessageExchangeCommand } from "./message-exchange.command";

export interface MessageExchangeUseCaseResponse {
    success: boolean;
    error?: string;
    data?: any;
}

export class MessageExchangeUseCase {

    private readonly _eventPublisher: EventPublisher;
    private readonly MessageAggregate: MessageAggregate;

    constructor(eventPublisher: EventPublisher) {
        this.MessageAggregate = new MessageAggregate();
        this._eventPublisher = eventPublisher;
    }

    async execute(command: MessageExchangeCommand): Promise<MessageExchangeUseCaseResponse> {
        try {

            // 1. bussiness logic
            this.MessageAggregate.createMessage(command.props);

            // 2. publish domain events
            const domainEvents = this.MessageAggregate.pullDomainEvents();
            await this._eventPublisher.publishAll(domainEvents);

            // 3. return response
            return {
                success: true,
                data: this.MessageAggregate.getEntityProps(),
            };
        } catch (error) {
            return {
                success: false,
                error: "Something went wrong creating the message",
            }
        }
    }
}