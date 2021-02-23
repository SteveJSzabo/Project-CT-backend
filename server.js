// SECTION Modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const dotenv = require('dotenv')
const colors = require('colors');
const connectDB = require("./Config/DB");
// const clanMembers = require('')

const PORT = process.env.PORT || 5000;
dotenv.config()
connectDB();


// SECTION MiddleWare
// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	const url = req.url;
	const method = req.method;
	const requestedAt = new Date().toLocaleString();
	console.table({ url, method, requestedAt });
	next();
});

// SECTION Routes
app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/pages/index.html`);
});

app.get("/test", (req, res) => {
	res.send("Sending from server. ");
});

// app.use('/api/v1/users', routes.users);

// SECTION Start Server
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`.yellow.underline.bold));
