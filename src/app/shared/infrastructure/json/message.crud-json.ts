import * as fs from "fs";
import * as path from "path";

import { Message, MessageCrudRepository } from "../../domain/repository/messgae.crud-repository";

export class MessageCrudJSON implements MessageCrudRepository {

    private static FILE_PATH = path.join(__dirname, 'messages.json');

    constructor() { }

    async create(item: Message): Promise<Message | null> {
        try {
            let messages: Message[] = [];
            if (fs.existsSync(MessageCrudJSON.FILE_PATH)) {
                const data = fs.readFileSync(MessageCrudJSON.FILE_PATH, 'utf-8');
                messages = JSON.parse(data) as Message[];
            }
            messages.push(item);
            fs.writeFileSync(MessageCrudJSON.FILE_PATH, JSON.stringify(messages, null, 2), 'utf-8');
            return Promise.resolve(item);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[message.crud-json] - [create] -error: ${errorMessage}`);
            return Promise.resolve(null);
        }
    }

    async findAll(): Promise<Message[]> {
        try {
            if (fs.existsSync(MessageCrudJSON.FILE_PATH)) {
                const data = fs.readFileSync(MessageCrudJSON.FILE_PATH, 'utf-8');
                const messages = JSON.parse(data) as Message[];
                return Promise.resolve(messages);
            } else {
                return Promise.resolve([]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[message.crud-json] - [findAll] - error: ${errorMessage}`);
            return []
        }
    }
    findById(id: string): Promise<Message | null> {
        throw new Error("Method not implemented.");
    }
    findByFields(fields: Partial<Message>): Promise<Message | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, item: Partial<Message>): Promise<Message | null> {
        throw new Error("Method not implemented.");
    }
    softDelete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    destroy(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}