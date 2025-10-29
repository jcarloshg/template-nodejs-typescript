import { connectProducer, emitMessage } from "@/app/shared/infrastructure/kafka/producer"

describe('Producer.test', () => {
    it("should work", async () => {
        // const message = {
        //     uuid: crypto.randomUUID(),
        //     text: "TEXT-FOR-TEST",
        //     timestamp: new Date()
        // }

        await connectProducer();
        await emitMessage("christian is gay");
        
        expect(true).toBe(true);
    })
})