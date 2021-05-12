const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptos = new Schema({
    coinName: {
        type: String,
        required: true,
    },
    coinSign: {
        type: String,
        required: true,
    },
    coinImg: {
        type: String,
        required: true,
    },
    coinPrice: {
        type: Number,
        required: true,
        default: 1,
    },
    coinChange: {
        type: Number,
        required: true,
        default: 1,
    },
    coinInfo: {
        type: String,
        required: true,
        default: 'ajdsfklasdfffffffffffffffffffffffffff',
    },
})

const Crypto = mongoose.model('Crypto', cryptos)

module.exports = Crypto