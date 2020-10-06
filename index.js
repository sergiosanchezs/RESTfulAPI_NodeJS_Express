import express from 'express';
import routes from './src/routes/crmRoutes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(helmet());

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
  console.log(req.headers);
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT'
  ) {
    console.log(req.headers.authorization.split(' ')[0]);
    console.log(req.headers.authorization.split(' ')[1]);
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], SECRET_KEY, (err, decoded) => {
      if (err) req.user = undefined;
      else req.user = decoded;
      console.log(decoded);
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

app.get('/', (req, res) => res.send(`Node & Express server running on port ${PORT}`));

app.listen(PORT, () => console.log(`Your server is running on port ${PORT}`));
