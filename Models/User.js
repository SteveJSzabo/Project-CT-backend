const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	user_id: {
		type: mongoose.ObjectId,
		required: true,
	},
	is_admin: {
		type: Boolean,
		required: true,
	},
	username: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	slug: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	bungie_membership_id: {
		type: String,
		required: true,
	},
	bungie_clanmember_type: {
		type: Number,
		required: true,
	},
	main_class: {
		type: PlayerClass,
		required: true,
	},
	focus: {
		type: String,
		required: true,
	},
	player_type: {
		type: PlayerType,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	steam_profile: {
		type: String,
	},
	youtube_profile: {
		type: String,
	},
	twitch_profile: {
		type: String,
	},
	gaurdian_image: {
		type: String,
		required: true,
		default: "https://static0.srcdn.com/wordpress/wp-content/uploads/2021/01/Destiny-2-Uldren-Sov-Most-Hated-Character-Now-Crow-Best-Adorable.jpg"
	},
	signup_date: {
		type: Date,
		default: Date.now,
	},
});


const User = mongoose.model("User", UserSchema);
module.exports = {
	User
};
