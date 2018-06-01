"use strict";

var _firebaseFunctions = require("firebase-functions");

var functions = _interopRequireWildcard(_firebaseFunctions);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _shopifyApiNode = require("shopify-api-node");

var _shopifyApiNode2 = _interopRequireDefault(_shopifyApiNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const shopify = new _shopifyApiNode2.default({
  shopName: 'cubachtung.myshopify.com',
  apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
  password: '7f6a7e330da245f0049ff3a642e3abdc'
});

const app = (0, _express2.default)();
app.use((0, _cors2.default)({ origin: true }));

app.get('/products/:id/similar', (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    const product_id = req.params.id;

    // fetch collects from product id
    const collects = yield shopify.collect.list({ product_id, fields: 'product_id,collection_id' });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

exports.s = functions.https.onRequest(app);
