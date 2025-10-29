import { DomainEvent } from "./domain-event";

export class EventHandler<T extends DomainEvent> {
  async handle(event: T): Promise<void> {
    throw new Error("EventHandler.handle - Method not implemented.");
  }

  public subscribeTo(): string {
    throw new Error("EventHandler.subscribeTo - Method not implemented.");
  }
}
