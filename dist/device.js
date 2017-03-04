'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Device = function () {
  function Device(cable, uid, _ref) {
    var onPaymentCreated = _ref.onPaymentCreated,
        onPaymentComplete = _ref.onPaymentComplete;

    _classCallCheck(this, Device);

    this.cable = cable;
    this.uid = uid;
    this.onPaymentCreated = onPaymentCreated;
    this.onPaymentComplete = onPaymentComplete;
  }

  _createClass(Device, [{
    key: 'bindEvents',
    value: function bindEvents() {
      var device = this;
      var channel = 'DeviceChannel';
      var subscriptions = this.cable.subscriptions;
      var uid = this.uid;


      subscriptions.create({ channel: channel, uid: uid }, {
        connected: function connected() {
          device._onConnect();
        },
        disconnected: function disconnected() {
          device._onDisconnect();
        },
        rejected: function rejected() {
          device._onRejected();
        },
        received: function received(data) {
          device._onReceived(data);
        },


        // Custom Methods

        payment_created: function payment_created(payment) {
          device.onPaymentCreated(payment);
        },
        payment_complete: function payment_complete(payment) {
          device.onPaymentComplete(payment);
        }
      });
    }
  }, {
    key: '_onConnect',
    value: function _onConnect() {
      console.log('Device: Connected');
    }
  }, {
    key: '_onDisconnect',
    value: function _onDisconnect() {
      console.log('Device: Disconnected');
    }
  }, {
    key: '_onRejected',
    value: function _onRejected() {
      console.log('Device: Rejected');
    }
  }, {
    key: '_onReceived',
    value: function _onReceived(data) {
      console.log('Device: Received', data);

      var payment = data.payment;


      if (payment) {
        if (payment.complete) {
          this.onPaymentComplete(payment);
        } else {
          this.onPaymentCreated(payment);
        }
      }
    }
  }]);

  return Device;
}();

exports.default = Device;