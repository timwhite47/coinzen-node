import Mnemonic from 'bitcore-mnemonic';
import Device from './device';
import Withdrawal from './withdrawal';
import Promise from 'bluebird';

function postResource(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

function getResource(url) {
  return fetch(url).then((response) => response.json());
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

  fetchUserStatus(userId, host = 'http://localhost:3000') {
    return getResource(`${host}/users/${userId}`)
      .then(({ user }) => user);
  }

  claimDevice(deviceId, activationCode, host = 'http://localhost:3000') {
    return postResource(`${host}/devices/${deviceId}/claim`, {
      device: {
        activation_code: activationCode,
      },
    }).then(({ device }) => device);
  }

  createPayment(deviceId, userId, satoshis, message, host = 'http://localhost:3000') {
    return postResource(`${host}/devices/${deviceId}/payments`, {
      payment: {
        user_id: userId,
        satoshis,
        message,
      },
    });
  }

  createWithdrawal(userId, address, host = 'http://localhost:3000') {
    return postResource(`${host}/users/${userId}/withdrawals`, {
      withdrawal: {
        address,
      },
    }).then(({ withdrawal }) => withdrawal);
  }

  verifyBackup(backup, hdPrivKey) {
    return new Promise((resolve, reject) => {
      try {
        const code = Mnemonic(backup);
        const recoveredKey = code.toHDPrivateKey();

        if (recoveredKey.xprivkey === hdPrivKey) {
          resolve();
        } else {
          reject(new Error('Back up not valid, please make sure you typed it correctly and try again'));
        }
      } catch (e) {
        reject(e);
      }
    });

  }
}
exports.Withdrawal = Withdrawal;
exports.Device = Device;
export default Coinzen;
