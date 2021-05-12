const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('../models/users')
const Crypto = require('../models/cryptos')
const axios = require('axios').default

const { isLoggedIn } = require('../functions/middleware')

// Crypto Get Routes

// Add Crypto Route
router.get('/createCrypto', (req, res) => {
    res.render('cryptos/createCryptos')
})
//

// Shows All Cryptos (In production Would be more of an admin tool and we would add search bar)
router.get('/allCryptos', catchAsync(async(req, res) => {
    const cryptos = await Crypto.find({})
    res.render('cryptos/allCryptos', { cryptos})
}))
//

// Displays Individual Crypto
router.get('/crypto/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const crypto = await Crypto.findById(id)
    const cryptos = await Crypto.find({})
    res.render('cryptos/crypto', { crypto, cryptos })
}))
//

// Updates Individual Crypto
router.get('/crypto/:id/update', catchAsync(async(req, res) => {
    const { id } = req.params
    const crypto = await Crypto.findById(id)
    res.render('cryptos/cryptoUpdate', { crypto })
}))

// Create new Crypto

// Creates New Crypto
router.post('/newCrypto', catchAsync(async(req, res) => {
    const { coinImg, coinName, coinSign } = req.body;
    const coin = new Crypto({ coinName, coinSign, coinImg})
    await coin.save()
    req.flash('success', 'Crypto Successfully Created!')
    res.redirect('/allCryptos')
}))
//

// Update Crypto
router.put('/crypto/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const coin = await Crypto.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/crypto/${id}`);
}))
//

// Delete Crypto
router.delete('/crypto/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const deletedCoin = await Crypto.findByIdAndDelete(id)
    res.redirect('/allCryptos')
}))
//

module.exports = router;
