class Device {
  constructor(cable, uid, { onPaymentCreated, onPaymentComplete }) {
    this.cable = cable;
    this.uid = uid;
    this.onPaymentCreated = onPaymentCreated;
    this.onPaymentComplete = onPaymentComplete;
  }

  bindEvents() {
    const device = this;
    const channel = 'DeviceChannel';
    const { cable: { subscriptions } } = this;
    const { uid } = this;

    subscriptions.create({ channel, uid }, {
      connected() {
        device._onConnect();
      },
      disconnected() {
        device._onDisconnect();
      },
      rejected() {
        device._onRejected();
      },
      received(data) {
        device._onReceived(data);
      },

      // Custom Methods

      payment_created(payment) {
        device.onPaymentCreated(payment);
      },

      payment_complete(payment) {
        device.onPaymentComplete(payment);
      },
    });
  }

  _onConnect() {
    console.log('Device: Connected');
  }

  _onDisconnect() {
    console.log('Device: Disconnected');
  }

  _onRejected() {
    console.log('Device: Rejected');
  }

  _onReceived(data) {
    console.log('Device: Received', data);

    const { payment } = data;

    if (payment) {
      if (payment.complete) {
        this.onPaymentComplete(payment);
      } else {
        this.onPaymentCreated(payment);
      }

    }
  }
}

export default Device;
