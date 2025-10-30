import { Consumer, EachBatchPayload, EachMessagePayload, Kafka, Partitioners } from 'kafkajs';
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

    public static async emmit(event: MessageCreatedDomainEvent): Promise<void> {

        // get kafka instance & producer
        const kafka = InitKafka.getInstance().kafka;
        const producer = kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner
        });

        try {
            await producer.connect();
            await producer.send({
                topic: MessageCreatedDomainEvent.eventName,
                messages: [
                    {
                        key: event.getEventName,
                        value: JSON.stringify(event.toPrimitives()),
                    },
                ],
            });
        } catch (error) {
            console.error('Error publishing event:', error);
        } finally {
            await producer.disconnect();
        }
    }
}

export type HandlerFunction = (event: MessageCreatedDomainEvent) => Promise<void>;

export class MessageCreatedKafkaConsumer {

    private _handler: HandlerFunction;
    private _consumer: Consumer;

    constructor(handler: HandlerFunction) {
        this._handler = handler;
        const kafka = InitKafka.getInstance().kafka;
        this._consumer = kafka.consumer({
            groupId: 'event-bus-kafka'
        });
    }

    public async init(): Promise<void> {
        await this._consumer.connect();
        await this._consumer.subscribe({
            topics: [MessageCreatedDomainEvent.eventName],
            fromBeginning: false,
        });
        await this._consumer.run({
            eachMessage: async (payload: EachMessagePayload) => {
                // await this._handler({});
            },
        });
    }


}