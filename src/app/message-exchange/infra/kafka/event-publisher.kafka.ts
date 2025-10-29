import { DomainEvent } from "@/app/shared/domain/domain-event/domain-event";
import { EventBus } from "@/app/shared/domain/domain-event/event-bus";
import { EventPublisher } from "@/app/shared/domain/domain-event/event-publisher";


export class EventPublisherKafka implements EventPublisher {
    private readonly _eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this._eventBus = eventBus;
    }

    public async publish(event: DomainEvent): Promise<void> {
        this._eventBus.publish(event);
    }

    public async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this._eventBus.publish(event);
        }
    }
}
