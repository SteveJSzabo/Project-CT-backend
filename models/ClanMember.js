const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerclassSchema = new Schema({
	classId: {
		type: mongoose.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	}
});

const focustypeSchema = new Schema({
	playsId: {
		type: mongoose.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	}
})

const playertypeSchema = new Schema({
	playerTypeId: {
		type: mongoose.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	}
});

const clanmemberSchema = new Schema({
	clanMemberId: {
		type: mongoose.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	bungie_membershipid: {
		type: String,
		require: true
	},
	bungie_clanmembertype: {
		type: int,
		require: true
	},
	main_class: {
		type: PlayerClass,
		required: true
	},
	focus: {
		type: [FocusType],
		required: true
	},
	player_type: {
		type: PlayerType,
		required: true
	},
	description: {
		type: String,
		requied: true
	},
	steam_profile: String,
	youtube_profile: String,
	twitch_profile: String,
	player_image: {
		type: String,
		required: true
	}
});



const PlayerClass = mongoose.model("PlayerClass", playerclassSchema);
const FocusType = mongoose.model("FocusType", focustypeSchema);
const PlayerType = mongoose.model("PlayerType", playertypeSchema);
const ClanMember = mongoose.model("ClanMember", clanmemberSchema);
module.exports = ClanMember;
