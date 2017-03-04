import sinon from 'sinon';
import { Device } from '../src';
import { expect } from 'chai';
describe('Device', () => {
  beforeEach(function () {
    this.subscriptionCreateStub = sinon.stub();
    this.onPaymentCreatedStub = sinon.stub();
    this.onPaymentCompleteStub = sinon.stub();
    this.id = 12345;

    this.cable = {
      subscriptions: {
        create: this.subscriptionCreateStub,
      },
    };

    this.subject = new Device(this.cable, this.id, {
      onPaymentCreated: this.onPaymentCreatedStub,
      onPaymentComplete: this.onPaymentCompleteStub,
    });

    this.subject.bindEvents();
  });

  it('creates subcription with correct params', function () {
    const { firstCall: { args: [{ channel, uid }] } } = this.subscriptionCreateStub;
    expect(channel).to.equal('DeviceChannel');
    expect(uid).to.equal(this.id);
  });

  describe('events', () => {
    describe('payment_created', () => {
      beforeEach(function () {
        const { firstCall: { args: [params, events] } } = this.subscriptionCreateStub;
        this.params = params;
        this.events = events;

        this.events.payment_created({ payment: { id: 12345 } });
      });

      it('triggers onPaymentCreated callback', function () {
        const { callCount } = this.onPaymentCreatedStub;
        expect(callCount).to.equal(1);
      });
    });
  });

  describe('payment_complete', () => {
    beforeEach(function () {
      const { firstCall: { args: [params, events] } } = this.subscriptionCreateStub;
      this.params = params;
      this.events = events;

      this.events.payment_complete({ payment: { id: 12345 } });
    });

    it('triggers onPaymentComplete callback', function () {
      const { callCount } = this.onPaymentCompleteStub;
      expect(callCount).to.equal(1);
    });
  });
});
