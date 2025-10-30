import { DomainEvent, DomainEventPrimitives } from "./domain-event";
import { EventHandler } from "./event-handler";


export interface EventBus {
  handlers: Map<string, EventHandler<any>[]>;
  subscribe<T extends DomainEventPrimitives>(eventType: string, handler: EventHandler<T>): void;
  publish(event: DomainEvent): Promise<void>;
}
