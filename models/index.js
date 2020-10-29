const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/project_ct";

mongoose
	.connect(DB_URL, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connect on port 27017"))
	.catch((err) => console.log(`MongoDB connection failed with Error: ${err}`));

module.exports = {
	ClanMember: require("./ClanMember.js"),
};
