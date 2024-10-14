
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./uptick-web3-sdk.cjs.production.min.js')
} else {
  module.exports = require('./uptick-web3-sdk.cjs.development.js')
}
