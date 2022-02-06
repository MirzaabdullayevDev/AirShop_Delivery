const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require("morgan")
const flash = require('connect-flash')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const error404Handler = require('./middleware/error404')
const path = require('path')
//routes
const adminRouter = require('./routes/admin')
const indexRouter = require('./routes/index')
const infoRouter = require('./routes/info')
const authRouter = require('./routes/auth')
const userAccauntRouter = require('./routes/userAccaunt')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const cartRouter = require('./routes/cart')
const deliveryCostRouter = require('./routes/deliveryCost')
const driversRouter = require('./routes/drivers')

require('dotenv').config()

const app = express()
const store = MongoStore({
    collection: 'sessions',
    uri: process.env.MONGO_URI
})

app.engine('hbs', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'))
//connecting to database

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))



app.use(flash())
app.use(varMiddleware)
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(__dirname + '/uploads'))
app.use(express.static(__dirname + '/public'));
//Регистрация роутов
app.use('/admin', adminRouter)
app.use('/', indexRouter)
app.use('/info', infoRouter)
app.use('/auth', authRouter)
app.use('/userAccaunt', userAccauntRouter)
app.use('/categories', categoryRouter)
app.use('/orders', orderRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/deliveryCost', deliveryCostRouter)
app.use('/drivers', driversRouter)
app.use(error404Handler)
const bot = require('./models/driverBot')
const controllers = require('./controllers/drivers')
bot.onText(/\/registerMe/, controllers.register)
module.exports = app