export class DomainEvent {
    public static readonly eventName: string = "DOMAIN.EVENT";
    public readonly eventUuid = crypto.randomUUID();
    public readonly occurredOn: Date;
    public readonly aggregateId?: string;

    protected constructor(aggregateId?: string) {
        this.occurredOn = new Date();
        this.aggregateId = aggregateId;
    }

    public get getEventName(): string {
        return DomainEvent.eventName;
    }

    public getMetadata(): Record<string, any> {
        return {
            eventUuid: this.eventUuid,
            occurredOn: this.occurredOn.toISOString(),
            aggregateId: this.aggregateId,
        };
    }
}
