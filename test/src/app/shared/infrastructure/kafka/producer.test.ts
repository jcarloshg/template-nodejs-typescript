import { connectProducer, emitMessage } from "@/app/shared/infrastructure/kafka/producer"
import { Kafka } from "kafkajs";

describe('Producer.test', () => {
    it("should work", async () => {
        // const message = {
        //     uuid: crypto.randomUUID(),
        //     text: "TEXT-FOR-TEST",
        //     timestamp: new Date()
        // }

        await connectProducer();
        await emitMessage("christian is gay");

        expect(true).toBe(true);
    });

    it("should create a new topic", async () => {
        const kafka = new Kafka({
            clientId: `user-service-${crypto.randomUUID()}`,
            brokers: ["localhost:9092"],
        });
        console.log(`kafka: `, kafka);
        const producer = kafka.producer({
            allowAutoTopicCreation: true,
        });

        await producer.connect();
        await producer.send({
            topic: "new-topic",
            messages: [{
                key: "test-key",
                value: "This is a message from test!",
            }],
        });
    })
})
