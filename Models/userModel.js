const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name']
    },
    username: {
      type: String,
      required: [true, 'Please enter username'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      select: false
    },
    plain_password: String,
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'member'],
      default: 'member'
    },
    bungie_membership_id: {
      type: String,
      required: [true, 'Please enter bungie_membership_id']
    },
    bungie_clanmember_type: {
      type: String,
      required: [true, 'Please enter bungie_clanmember_type']
    },
    main_class: {
      type: String,
      required: [true, 'Please enter main_class']
    },
    focus: {
      type: String,
      required: [true, 'Please enter focus']
    },
    player_type: {
      type: String,
      required: [true, 'Please enter player_type']
    },
    description: {
      type: String,
      required: [true, 'Please enter description']
    },
    steam_profile: {
      type: String
    },
    youtube_profile: {
      type: String
    },
    twitch_profile: {
      type: String
    },
    avatar: {
      type: String,
      required: true,
      default: 'default.jpg'
    },
    signup_date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function (next) {
  this.plain_password = this.password;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
