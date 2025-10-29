import express from "express";
import cors from "cors";
import { enviromentVariables } from "./app/shared/infrastructure/utils/enviroment-variables";
import { messageRoute } from "./presentation/routes/send.routes";

const app = express();

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
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 Environment: ${enviromentVariables.nodeEnv}`);
});

export default app;
