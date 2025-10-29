const { Kafka } = require("kafkajs");
import { DomainEvent } from "@/app/shared/domain/domain-event/domain-event";
import { EventBus } from "@/app/shared/domain/domain-event/event-bus";
import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent } from "../../domain/domain-event/message-created.domain-event";

export class EventBusKafka implements EventBus {

    private kafka: any;

    handlers: Map<string, EventHandler<any>[]> = new Map();

    constructor() {
        this.kafka = new Kafka({
            clientId: `user-service-${crypto.randomUUID()}`,
            brokers: ["localhost:9092"],
        });
    }

    async subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): Promise<void> {
        // if (!this.handlers.has(eventType)) {
        //     this.handlers.set(eventType, []);
        // }
        // this.handlers.get(eventType)!.push(handler);
        const consumer = this.kafka.consumer();

        await consumer.connect()
        await consumer.subscribe({
            topic: MessageCreatedDomainEvent.eventName,
            fromBeginning: false
        });

        await consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: {
                topic: string;
                partition: number;
                message: any;
            }) => {
                console.log(`{ topic, partition, message }: `, {
                    topic,
                    partition,
                    message,
                });
                console.log({
                    value: message.value.toString(),
                });
            },
        });
    }

    async publish(event: DomainEvent): Promise<void> {
        const producer = this.kafka.producer();
        await producer.connect();
        await producer.send({
            topic: MessageCreatedDomainEvent.eventName,
            messages: [
                {
                    key: event.getEventName,
                    value: JSON.stringify(event),
                },
            ],
        });
        await producer.disconnect();
    }
}