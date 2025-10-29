import express from "express";
import cors from "cors";
import { createServer } from 'http';

import { enviromentVariables } from "./app/shared/infrastructure/utils/enviroment-variables";
import { messageRoute } from "./presentation/routes/send.routes";
import { SocketIO } from "./presentation/sockets/socket";
import { ChatMessageController } from "./presentation/sockets/chat-message.controller";

const app = express();
const httpServer = createServer(app);

const socketIO = new SocketIO(httpServer);
new ChatMessageController(socketIO);

// ─────────────────────────────────────
// Middlewares
// ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: enviromentVariables.cors.origin,
        credentials: enviromentVariables.cors.credentials,
    })
);

// paths
messageRoute(app);

const PORT = enviromentVariables.port;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 Environment: ${enviromentVariables.nodeEnv}`);
});

export default app;
