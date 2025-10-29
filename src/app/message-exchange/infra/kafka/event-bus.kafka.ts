import { Kafka, EachMessagePayload, Partitioners } from 'kafkajs';
import { DomainEvent } from "@/app/shared/domain/domain-event/domain-event";
import { EventBus } from "@/app/shared/domain/domain-event/event-bus";
import { EventHandler } from "@/app/shared/domain/domain-event/event-handler";
import { MessageCreatedDomainEvent } from "../../domain/domain-event/message-created.domain-event";

export class EventBusKafka implements EventBus {

    private kafka: Kafka;
    private isConsumerRunning: boolean = false;

    handlers: Map<string, EventHandler<any>[]> = new Map();

    constructor() {
        this.kafka = new Kafka({
            clientId: `user-service-${crypto.randomUUID()}`,
            brokers: ["localhost:9092"],
        });
    }

    async subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): Promise<void> {

        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)!.push(handler);

        // Start consumer only once
        if (!this.isConsumerRunning) {
            await this.startConsumer();
            this.isConsumerRunning = true;
        }
    }

    private async startConsumer(): Promise<void> {
        try {
            console.log("Starting Kafka consumer...");

            const consumer = this.kafka.consumer({
                groupId: 'event-bus-kafka'
            });
            await consumer.connect();
            await consumer.subscribe({
                topics: [MessageCreatedDomainEvent.eventName],
                fromBeginning: false,
            });

            await consumer.run({
                // eachBatch: async (payload: EachBatchPayload) => {
                //     console.log(`Processing batch from topic:`, payload.batch.topic);
                //     console.log(`number of batch: ${payload.batch.messages.length}`);
                //     // for (const message of payload.batch.messages) {
                //     //     console.log(`Message offset:`, message.offset);
                //     //     console.log(`Message value:`, message.value?.toString());
                //     // }
                // },

                eachMessage: async (payload: EachMessagePayload) => {
                    console.log(`Received message offset:`, payload.message.offset);
                }

                //     // Process message with registered handlers
                //     // try {
                //     //     const parsedEvent = JSON.parse(payload.message.value.toString());
                //     //     const eventType = parsedEvent.eventName || payload.topic;

                //     //     if (this.handlers.has(eventType)) {
                //     //         const handlers = this.handlers.get(eventType)!;
                //     //         for (const handler of handlers) {
                //     //             await handler.handle(parsedEvent);
                //     //         }
                //     //     }
                //     // } catch (error) {
                //     //     console.error('Error processing message:', error);
                //     // }
                // },
            });
        } catch (error) {
            console.error('Error starting consumer:', error);
            this.isConsumerRunning = false;
            throw error;
        }
    }

    async publish(event: DomainEvent): Promise<void> {
        const producer = this.kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });
        try {
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
        } catch (error) {
            console.error('Error publishing event:', error);
            throw error;
        } finally {
            await producer.disconnect();
        }
    }


}