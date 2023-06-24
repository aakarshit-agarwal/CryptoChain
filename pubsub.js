import PubNub from 'pubnub';
import dotenv from 'dotenv';

const CHANNELS = {
    TEST: 'TEST',
};

class PubSub {
    constructor() {
        dotenv.config();

        const CREDENTIALS = {
            publishKey: process.env.publishKey,
            subscribeKey: process.env.subscribeKey,
            secretKey: process.env.secretKey,
            uuid: process.env.uuid,
        };
        console.log(CREDENTIALS);
        this.pubnub = new PubNub(CREDENTIALS);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: (messageObject) => {
                const { channel, message } = messageObject;

                console.log(
                    `Message received. Channel: ${channel}. Message: ${message}`
                );
            },
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}

export default PubSub;
