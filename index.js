import express from 'express';
import routes from './src/routes/crmRoutes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

// helmet setup
app.use(helmet());

// Rate limit setup
const limiter = new RateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes = 5 min * 60 seconds per min * 1000 ms
  max: 120, // Limit of number of request per IP
  delayMs: 0, // disable delays
});

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Setup route middlewares protection
const csrfProtection = csrf({ cookie: true });

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

// JWT setup
app.use((req, res, next) => {
  console.log(req.headers);
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT'
  ) {
    // console.log(req.headers.authorization.split(' ')[0]);
    // console.log(req.headers.authorization.split(' ')[1]);
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], SECRET_KEY, (err, decoded) => {
      if (err) req.user = undefined;
      else req.user = decoded;
      // console.log(decoded);
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', csrfProtection, (req, res) =>
  res.send(`Node & Express server running on port ${PORT}`),
);

app.listen(PORT, () => console.log(`Your server is running on port ${PORT}`));
