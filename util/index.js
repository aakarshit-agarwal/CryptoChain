import ec from 'elliptic';
import { cryptoHash } from './crypto-hash.js';

const ecx = new ec.ec('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ecx.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data), signature);
};

export { ecx, verifySignature, cryptoHash };
