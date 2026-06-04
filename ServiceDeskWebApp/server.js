import express from "express";
import dotenv from "dotenv";
import { QueueClient } from "@azure/storage-queue";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const queueClient = new QueueClient(
    process.env.AZURE_STORAGE_CONNECTION_STRING,
    process.env.QUEUE_NAME
);

await queueClient.createIfNotExists();

app.post("/api/ticket", async (req, res) => {

    try {

        const ticket = {
            id: crypto.randomUUID(),
            ...req.body
        };

        const messageText =
            Buffer.from(
                JSON.stringify(ticket)
            ).toString("base64");

        await queueClient.sendMessage(messageText);

        res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });
    }
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});