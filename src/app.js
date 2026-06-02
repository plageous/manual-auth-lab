import express from 'express';
import defaultRouter from './routers/routes.js';
import session from 'express-session';

//configure Express.js app
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    /*
    cookies: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
    */
}));

app.use((req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
    } else {
        req.user = null;
    }
    next();
});

//view engine
app.set("view engine", "ejs");
app.set("views", "src/views");

//static directories
app.use(express.static('public'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routers
app.use("/", defaultRouter);

export default app;