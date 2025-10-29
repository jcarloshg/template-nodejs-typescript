const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: `user-service-${crypto.randomUUID()}`,
    brokers: ["localhost:9092"],
});
const producer = kafka.producer();