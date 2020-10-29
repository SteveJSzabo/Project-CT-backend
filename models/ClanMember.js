const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clanmemberSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	main_class: {
		type: String,
		required: true,
	},
	plays: {
		type: String,
		required: true,
	},
	player_type: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		requied: true,
	},
	steam_profile: {
		type: String,
	},
	player_image: {
		type: String,
		required: true,
	},
});

const ClanMember = mongoose.model("ClanMember", clanmemberSchema);
module.exports = ClanMember;
