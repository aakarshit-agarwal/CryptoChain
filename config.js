const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: 1000,
    lastHash: '----',
    hash: 'fakeHash',
    data: ['Fake', 'Data'],
    difficulty: 3,
    nonce: 0,
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorized-reward*' };

const MINING_REWARD = 50;

export {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD,
};
