// SECTION Modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/DB');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

const PORT = process.env.PORT || 5000;
dotenv.config();
connectDB();

const app = express();

// SECTION MiddleWare
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve cookie in request object
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(hpp());

app.use((req, res, next) => {
  const url = req.url;
  const method = req.method;
  const requestedAt = new Date().toLocaleString();
  console.table({ url, method, requestedAt });
  next();
});

// SECTION Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// SECTION Start Server
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`
      .yellow.underline.bold
  )
);
