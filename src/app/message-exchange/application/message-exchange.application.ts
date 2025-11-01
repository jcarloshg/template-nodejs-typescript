import { MessageCrudPostgress } from "@/app/shared/infrastructure/postgres/message.crud-postgress";
import { MessageExchangeCommand } from "../domain/message-exchange.command";
import { MessageExchangeUseCase } from "../domain/message-exchange.use-case";
import { EventBusKafka } from "../infra/kafka/event-bus.kafka";
import { EventPublisherKafka } from "../infra/kafka/event-publisher.kafka";
import { NotifyEventHandler } from "./domain-handlers/notify.event-handler";
import { SaveInRepoEventHandler } from "./domain-handlers/save-in-repo.event-handler";
import { SendMessageToRecipientsEventHandler } from "./domain-handlers/send-message-to-recipients.event-handler";

export class MessageExchangeApplication {

    constructor() { }

    async execute(req: MessageExchangeRequest): Promise<MessageExchangeResponse> {
        try {

            // 1, valid command
            const command = new MessageExchangeCommand(req.body);

            // ─────────────────────────────────────
            // event handlers registration
            // ─────────────────────────────────────

            const eventBus = new EventBusKafka();
            const eventPublisher = new EventPublisherKafka(eventBus);

            // register event handlers
            const notifyEventHandler = await NotifyEventHandler
                .getInstance();
            eventBus.subscribe(
                notifyEventHandler.subscribeTo(),
                notifyEventHandler
            );
            const sendMessageToRecipientsEventHandler = await SendMessageToRecipientsEventHandler
                .getInstance();
            eventBus.subscribe(
                sendMessageToRecipientsEventHandler.subscribeTo(),
                sendMessageToRecipientsEventHandler
            );

            const saveInRepoEventHandler = await SaveInRepoEventHandler
                .getInstance(new MessageCrudPostgress());
            eventBus.subscribe(
                saveInRepoEventHandler.subscribeTo(),
                saveInRepoEventHandler
            );

            // ─────────────────────────────────────
            // execute use case
            // ─────────────────────────────────────
            const useCase = new MessageExchangeUseCase(eventPublisher);
            const result = await useCase.execute(command);
            return {
                success: true,
                data: result,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: errorMessage,
                // error: "Something went wrong. Try again later.",
            }
        }
    }
}

export interface MessageExchangeRequest {
    body: { [key: string]: any };
}

export interface MessageExchangeResponse {
    success: boolean;
    error?: string;
    data?: any;
}