'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bitcoreMnemonic = require('bitcore-mnemonic');

var _bitcoreMnemonic2 = _interopRequireDefault(_bitcoreMnemonic);

var _device = require('./device');

var _device2 = _interopRequireDefault(_device);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function postResource(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (response) {
    return response.json();
  });
}

var Coinzen = function () {
  _createClass(Coinzen, null, [{
    key: 'initializeDevice',
    value: function initializeDevice(uid) {
      var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'http://localhost:3000';

      return postResource(host + '/devices', { uid: uid });
    }
  }, {
    key: 'createUser',
    value: function createUser(_ref) {
      var email = _ref.email,
          password = _ref.password,
          password_confirmation = _ref.password_confirmation,
          livenet = _ref.livenet,
          _ref$host = _ref.host,
          host = _ref$host === undefined ? 'http://localhost:3000' : _ref$host;

      var network = livenet ? 'livenet' : 'testnet';
      var mnemonic = new _bitcoreMnemonic2.default();
      var hdPrivKey = mnemonic.toHDPrivateKey();
      var bip45PrivKey = hdPrivKey.derive('m/45\'');
      var bip45 = bip45PrivKey.hdPublicKey.toString(network);

      return postResource(host + '/users', {
        user: { email: email, password: password, password_confirmation: password_confirmation, bip45: bip45 }
      }).then(function (_ref2) {
        var user = _ref2.user;
        return { user: user, hdPrivKey: hdPrivKey, mnemonic: mnemonic };
      });
    }
  }, {
    key: 'authenticateUser',
    value: function authenticateUser(_ref3) {
      var email = _ref3.email,
          password = _ref3.password,
          _ref3$host = _ref3.host,
          host = _ref3$host === undefined ? 'http://localhost:3000' : _ref3$host;

      return postResource(host + '/users/authenticate', {
        user: { email: email, password: password }
      }).then(function (_ref4) {
        var jwt = _ref4.jwt;
        return jwt;
      });
    }
  }]);

  function Coinzen(jwt, cable) {
    _classCallCheck(this, Coinzen);

    this.cable = cable;
    this.jwt = jwt;
  }

  _createClass(Coinzen, [{
    key: 'claimDevice',
    value: function claimDevice(deviceId, activationCode) {
      var host = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'http://localhost:3000';

      return postResource(host + '/devices/' + deviceId + '/claim', {
        device: {
          activation_code: activationCode
        }
      }).then(function (_ref5) {
        var device = _ref5.device;
        return device;
      });
    }
  }]);

  return Coinzen;
}();

exports.Device = _device2.default;
exports.default = Coinzen;