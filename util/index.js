import { ec as EC } from 'elliptic';
import cryptoHash from './crypto-hash';

const ec = new EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data), signature);
};

export { ec, verifySignature, cryptoHash };
