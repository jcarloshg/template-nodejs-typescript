import { Express, Router } from "express";
import { ChatMessagePayload, ChatMessageController } from "../sockets/chat-message.controller";
import { MessageExchangeApplication } from "@/app/message-exchange/application/message-exchange.application";

export const messageRoute = async (app: Express) => {
    const router = Router();

    router.get("/health", (req, res) => {
        res.send("Messages Service is up and running!");
    });


    router.post('/', async (req, res) => {
        try {
            const messageExchangeApplication = new MessageExchangeApplication();
            const result = await messageExchangeApplication.execute(req);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });

    // router.post('/', async (req, res) => {
    //     try {
    //         const { senderId, content } = req.body;
    //         if (!senderId || String(senderId).trim() === '') {
    //             return res
    //                 .status(400)
    //                 .send({ error: 'senderId is required' });
    //         }
    //         if (!content || String(content).trim() === '') {
    //             return res
    //                 .status(400)
    //                 .send({ error: 'content is required' });
    //         }
    //         const chatMessagePayload: ChatMessagePayload = {
    //             messageId: crypto.randomUUID(),
    //             senderId,
    //             content,
    //             timestamp: new Date()
    //         }
    //         ChatMessageController.emitChatMessage(chatMessagePayload);
    //         // await emitUserCreated(message);
    //         res
    //             .status(201)
    //             .send(
    //                 {
    //                     status: 'Message sent',
    //                     message: chatMessagePayload
    //                 }
    //             );
    //     } catch (error) {
    //         res.status(500).send({ error: 'Internal Server Error' });
    //     }
    // });

    app.use("/api/messages", router);
}