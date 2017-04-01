import { Withdrawal } from '../src/';
const WITHDRAWAL_FIXTURE = require('./fixtures/withdrawal.json');

describe('Withdrawal', () => {
  beforeEach(function () {
    this.withdrawal = new Withdrawal(WITHDRAWAL_FIXTURE.withdrawal);
  });

  it('logs', function () {
    console.log(this.withdrawal.tx.toJSON());
  });
});
