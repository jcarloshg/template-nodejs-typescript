import { Kafka, EachMessagePayload, Partitioners } from 'kafkajs';
import { MessageCreatedDomainEvent } from "@/app/message-exchange/domain/domain-event/message-created.domain-event";

export class InitKafka {

    // TODO: put this on envieronment variables
    public static readonly CLIENT_ID = 'message-exchange';
    public static readonly BROKERS = ['localhost:9092'];

    public readonly kafka: Kafka;
    private static instance: InitKafka;

    constructor() {
        this.kafka = new Kafka({
            clientId: InitKafka.CLIENT_ID,
            brokers: InitKafka.BROKERS,
        });
    }

    public static getInstance(): InitKafka {
        if (!InitKafka.instance)
            InitKafka.instance = new InitKafka();
        return InitKafka.instance;
    }
}

export class MessageCreatedKafkaProducer {
    constructor() { }

    public static async sendMessage(event: MessageCreatedDomainEvent): Promise<void> {

        // get kafka instance & producer
        const kafka = InitKafka.getInstance().kafka;
        const producer = kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });

        try {
            console.log(event.toPrimitives());
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