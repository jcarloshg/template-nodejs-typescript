import { z } from 'zod';

const schema = z.object({
    messageId: z.string(),
    senderId: z.string(),
    content: z.string(),
    timestamp: z.iso.datetime(),
});

export type MessageProps = z.infer<typeof schema>;

export class Message {

    private _props: MessageProps;

    constructor(data: { [key: string]: any }) {
        const parsed = schema.safeParse(data);
        if (parsed.success === false) throw new Error("Invalid message entity data");
        this._props = parsed.data;
    }

    public get props(): MessageProps {
        return this._props;
    }
}