import { emitMessage } from "@/app/shared/infrastructure/kafka/producer";
import { Express, Router } from "express";
import { ChatMessagePayload, ChatMessageSocket } from "../sockets/chat-message.socket";

export const messageRoute = async (app: Express) => {
    const router = Router();

    router.get("/health", (req, res) => {
        res.send("Messages Service is up and running!");
    });

    router.post('/', async (req, res) => {
        try {
            const { senderId, content } = req.body;
            if (!senderId || String(senderId).trim() === '') {
                return res
                    .status(400)
                    .send({ error: 'senderId is required' });
            }
            if (!content || String(content).trim() === '') {
                return res
                    .status(400)
                    .send({ error: 'content is required' });
            }
            const chatMessagePayload: ChatMessagePayload = {
                messageId: crypto.randomUUID(),
                senderId,
                content,
                timestamp: new Date()
            }
            ChatMessageSocket.emitChatMessage(chatMessagePayload);
            // await emitUserCreated(message);
            res
                .status(201)
                .send(
                    {
                        status: 'Message sent',
                        message: chatMessagePayload
                    }
                );
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });

    app.use("/api/messages", router);
}