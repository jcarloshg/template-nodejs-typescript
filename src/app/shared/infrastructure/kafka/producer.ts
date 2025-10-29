const { Kafka } = require("kafkajs");
import { networkInterfaces } from 'os';

const kafka = new Kafka({
    clientId: `user-service-${crypto.randomUUID()}`,
    brokers: ["localhost:9092"],
});
console.log(`kafka: `, kafka);
const producer = kafka.producer();

export const connectProducer = async () => await producer.connect();
export const emitMessage = async (usuario: any) => {
    await producer.send({
        topic: "message",
        messages: [{ value: JSON.stringify(usuario) }],
    });
};
