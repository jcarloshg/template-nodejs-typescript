import { Message, MessageCrudRepository } from "../../domain/repository/messgae.crud-repository";
import { MessageProgress } from "./message.model-postgress";

export class MessageCrudPostgress implements MessageCrudRepository {

    constructor() { }

    async create(item: Message): Promise<Message | null> {
        try {
            const newMessage = await MessageProgress.create({
                uuid: item.id,
                senderuuid: item.senderId,
                content: item.content,
                created_at: item.timestamp,
            });
            const message: Message = {
                id: newMessage.uuid,
                senderId: newMessage.senderuuid,
                content: newMessage.content,
                timestamp: newMessage.created_at,
            }
            return message;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [create]: ${errorMessage}`);
            return null
        }
    }

    async findAll(): Promise<Message[]> {
        try {
            const messagesRaw = await MessageProgress.findAll();
            const messages: Message[] = messagesRaw.map(
                msg => ({
                    id: msg.uuid,
                    senderId: msg.senderuuid,
                    content: msg.content,
                    timestamp: msg.created_at,
                })
            );
            return messages;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [findAll]: ${errorMessage}`);
            return [];
        }
    }

    async findById(id: string): Promise<Message | null> {
        try {
            const messageRaw = await MessageProgress.findByPk(id);
            if (!messageRaw) return null;
            const message: Message = {
                id: messageRaw.uuid,
                senderId: messageRaw.senderuuid,
                content: messageRaw.content,
                timestamp: messageRaw.created_at,
            };
            return message;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [findById]: ${errorMessage}`);
            return null;
        }
    }

    async findByFields(fields: Partial<Message>): Promise<Message | null> {
        try {
            const messageRaw = await MessageProgress.findOne({ where: fields });
            if (!messageRaw) return null;
            const message: Message = {
                id: messageRaw.uuid,
                senderId: messageRaw.senderuuid,
                content: messageRaw.content,
                timestamp: messageRaw.created_at,
            };
            return message;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [findByFields]: ${errorMessage}`);
            return null;
        }
    }

    async update(id: string, item: Partial<Message>): Promise<Message | null> {
        try {
            const [updatedRowsCount, [updatedMessageRaw]] = await MessageProgress.update(
                {
                    senderuuid: item.senderId,
                    content: item.content,
                    created_at: item.timestamp,
                },
                {
                    where: { uuid: id },
                    returning: true,
                }
            );
            if (updatedRowsCount === 0) return null;
            const updatedMessage: Message = {
                id: updatedMessageRaw.uuid,
                senderId: updatedMessageRaw.senderuuid,
                content: updatedMessageRaw.content,
                timestamp: updatedMessageRaw.created_at,
            };
            return updatedMessage;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [update]: ${errorMessage}`);
            return null;
        }
    }

    async softDelete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async destroy(id: string): Promise<boolean> {
        try {
            const deletedRowsCount = await MessageProgress.destroy({ where: { uuid: id } });
            return deletedRowsCount > 0;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[MessageCrudPostgress] - [destroy]: ${errorMessage}`);
            return false;
        }
    }
}