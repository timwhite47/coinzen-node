import { HDPrivateKey } from 'bitcore-lib';
import Mnemonic from 'bitcore-mnemonic';
import Device from './device';

function postResource(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

class Coinzen {
  static initializeDevice(uid, host = 'http://localhost:3000') {
    return postResource(`${host}/devices`, { uid });
  }

  static createUser({ email, password, password_confirmation, livenet, host = 'http://localhost:3000' }) {
    const network = livenet ? 'livenet' : 'testnet';
    const mnemonic = new Mnemonic();
    const hdPrivKey = mnemonic.toHDPrivateKey();
    const bip45PrivKey = hdPrivKey.derive('m/45\'');
    const bip45 = bip45PrivKey.hdPublicKey.toString(network);

    return postResource(`${host}/users`, {
      user: { email, password, password_confirmation, bip45 },
    }).then(({ user }) => ({ user, hdPrivKey, mnemonic }));
  }

  static authenticateUser({ email, password, host = 'http://localhost:3000' }) {
    return postResource(`${host}/users/authenticate`, {
      user: { email, password },
    }).then(({ jwt }) => jwt);
  }

  constructor(jwt, cable) {
    this.cable = cable;
    this.jwt = jwt;
  }

  claimDevice(deviceId, activationCode, host = 'http://localhost:3000') {
    return postResource(`${host}/devices/${deviceId}/claim`, {
      device: {
        activation_code: activationCode,
      },
    }).then(({ device }) => device);
  }
}

exports.Device = Device;
export default Coinzen;
