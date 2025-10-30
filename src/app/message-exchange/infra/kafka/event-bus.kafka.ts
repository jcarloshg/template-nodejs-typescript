import { DomainEvent, DomainEventPrimitives } from "@/app/shared/domain/domain-event/domain-event";
import { EventBus } from "@/app/shared/domain/domain-event/event-bus";
import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent } from "../../domain/domain-event/message-created.domain-event";
import { MessageCreatedKafkaProducer } from './init-kafka';

export class EventBusKafka implements EventBus {
    handlers: Map<string, EventHandler<any>[]> = new Map();

    constructor() { }

    async publish(event: DomainEvent): Promise<void> {
        await MessageCreatedKafkaProducer.emmit(event as MessageCreatedDomainEvent);
    }

    async subscribe<T extends DomainEventPrimitives>(eventType: string, handler: EventHandler<T>): Promise<void> {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)!.push(handler);
    }
}
