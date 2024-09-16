const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const app = express()
require('dotenv').config()
const cors = require('cors')

const authRouter = require('./routes/authRoutes')
const categoryRouter = require('./routes/categoriesRoutes')
const articlesRouter = require('./routes/articlesRoutes')
const usersRouter = require('./routes/usersRoute')
const bidsRouter = require('./routes/bidsRoutes')
const messagesRouter = require('./routes/messagesRoutes')

//database connection
const port = process.env.PORT;
const mongoURI = process.env.MONGO_URI;
const secretKey = process.env.SECRET_KEY;
const originRoute = process.env.CLIENT_ORIGIN 


mongoose.connect(mongoURI)

//setting up sessions
const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'userSession',
})

app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000  
        }
    }))


const corsOptions = {
    origin: originRoute, // Your frontend's origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/uploads', express.static('uploads'));


app.use('/auth', authRouter)
app.use('/categories', categoryRouter)
app.use('/articles', articlesRouter)
app.use('/users', usersRouter)
app.use('/bids', bidsRouter)
app.use('/messages', messagesRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});




app.listen(port, ()=> console.log('server is listening on port', port))
