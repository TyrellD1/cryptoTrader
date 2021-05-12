const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const axios = require('axios')
const catchAsync = require('./functions/catchAsync')
const ExpressError = require('./functions/expressError')
const User = require('./models/users')
const Crypto = require('./models/cryptos')

const otherRoutes = require('./routes/others')
const userRoutes = require('./routes/users')
const cryptoRoutes = require('./routes/cryptos')
const postRoutes = require('./routes/posts')

mongoose.connect('mongodb://localhost:27017/cryptoTrader', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("ERROR!")
        console.log(err)
    });

// Auto Price Updater Crypto

const cryptoUpdater = async () => {      
    const cryptos = await Crypto.find({})
    for(crypto of cryptos) {
        const price = await axios.get(`https://api.cryptonator.com/api/ticker/${crypto.coinSign}-usd`)
        const updatedCrypto = await Crypto.findByIdAndUpdate(crypto._id, { coinPrice: price.data.ticker.price, coinChange: price.data.ticker.change }, { runValidators: true })
    }
}

cryptoUpdater()

setInterval(cryptoUpdater, 30000);

app.set('views', path.join(__dirname, 'views')); // Connects to Views more effecively
app.set('models', path.join(__dirname, 'models')); // Connects to Models more effecively
app.set('view engine', 'ejs'); // Makes EJS Work

app.use(cookieParser('puppy'))
app.use(session({secret: 'pafs;lfj'}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Locals

app.use( catchAsync(async(req, res, next) => {
    if(req.user) {
        const user = req.user
        const userId = await user._id
        res.locals.currentUser = await User.findById(userId).populate('favoriteCryptos').populate('friends').populate({ path: 'posts', populate: { path: 'user'}})
    } else if (!req.user) {
        res.locals.currentUser = req.user
    }
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
}))

// setInterval(cryptoUpdater, 30000);
// setInterval(console.log('piano'), 5000)


//

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))) // Serving css __dirname is best practice
app.use(express.urlencoded({ extended: true}))

// Imported Routes

app.use('/', otherRoutes)
app.use('/', userRoutes)
app.use('/', cryptoRoutes)
app.use('/', postRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError(`Page Not Found ||| Lorem ipsum dolor sit amet consectetur
     adipisicing elit. Ad aperiam molestias sunt, asperiores omnis, 
     hic architecto cupiditate iure cumque expedita aspernatur explicabo! 
     Nemo, qui pariatur? Aspernatur molestiae cumque ad error.`, 404))
})

app.use(( err, req, res, next ) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "We've come accrosed an error!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('App is listening!!!')
})
