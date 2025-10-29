import { z } from 'zod';

const schema = z.object({
    messageId: z.string(),
    senderId: z.string(),
    content: z.string(),
    timestamp: z.iso.datetime(),
});

export type MessageExchangeCommandProps = z.infer<typeof schema>;

export class MessageExchangeCommand {

    public readonly props: MessageExchangeCommandProps;

    constructor(data: MessageExchangeCommandProps) {
        const parsed = schema.safeParse(data);
        if (parsed.success === false) throw new Error("Invalid message exchange command data");
        this.props = parsed.data;
    }
}