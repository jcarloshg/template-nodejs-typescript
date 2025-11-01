import { z } from 'zod';

const schema = z.object({
    messageId: z.string(),
    senderId: z.string().max(50),
    content: z.string().max(250),
    timestamp: z.iso.datetime(),
});

export type MessageExchangeCommandProps = z.infer<typeof schema>;

export class MessageExchangeCommand {

    public readonly props: MessageExchangeCommandProps;

    constructor(data: { [key: string]: any }) {
        const parsed = schema.safeParse(data);
        if (parsed.success === false) {
            const errorMessage = parsed.error
                .issues
                .map((err: any) => `${err.path.join('.')}: ${err.message}`)[0]
                
            throw new Error(errorMessage);
        }
        this.props = parsed.data;
    }
}