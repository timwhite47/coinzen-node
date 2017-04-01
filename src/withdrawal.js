import { Transaction } from 'bitcore-lib';

class Withdrawal {
  constructor({ tx: txHex, bip45_map: bip45Map }, ) {
    this.tx = new Transaction(txHex);
    this.bip45Map = bip45Map;
  }
}

export default Withdrawal;
