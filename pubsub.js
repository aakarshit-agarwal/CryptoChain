import PubNub from 'pubnub';
import dotenv from 'dotenv';

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
};

class PubSub {
    constructor({ blockchain }) {
        dotenv.config();

        const CREDENTIALS = {
            publishKey: process.env.publishKey,
            subscribeKey: process.env.subscribeKey,
            secretKey: process.env.secretKey,
            uuid: process.env.uuid,
        };

        this.blockchain = blockchain;
        this.pubnub = new PubNub(CREDENTIALS);

        this.subscribeToChannels();
        this.pubnub.addListener(this.listener());
    }

    subscribeToChannels() {
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    }

    listener() {
        return {
            message: (messageObject) => {
                const { channel, message } = messageObject;
                const parsedMessage = JSON.parse(message);
                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            },
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }
}

export default PubSub;
