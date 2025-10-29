import { emitMessage } from "@/app/shared/infrastructure/kafka/producer";
import { Express, Router } from "express";

export const messageRoute = async (app: Express) => {
    const router = Router();

    router.get("/health", (req, res) => {
        res.send("Messages Service is up and running!");
    });

    router.post('/', async (req, res) => {
        const message = {
            uuid: crypto.randomUUID(),
            text: "TEXT-FOR-TEST",
            timestamp: new Date()
        }

        // await emitUserCreated(message);
        res.status(201).send({ status: 'Message sent', message });
    });

    app.use("/api/messages", router);
}