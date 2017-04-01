'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bitcoreLib = require('bitcore-lib');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Withdrawal = function Withdrawal(_ref) {
  var txHex = _ref.tx,
      bip45Map = _ref.bip45_map;

  _classCallCheck(this, Withdrawal);

  this.tx = new _bitcoreLib.Transaction(txHex);
  this.bip45Map = bip45Map;
};

exports.default = Withdrawal;