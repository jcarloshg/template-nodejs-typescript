import { CrudRepository } from "./crud.repository";

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

export class MessageCrudRepository implements CrudRepository<Message> {

    constructor() { }

    create(item: Message): Promise<Message | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Message[]> {
        throw new Error("Method not implemented.");
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