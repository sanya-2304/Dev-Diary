const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto'); // helps in hashing the password
const { createTokenforUser } = require('../services/auth');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: 'data:image/png;base64,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'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString('hex'); // Random strings
    const hashedPass = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPass;
    next();
});

userSchema.static('matchPasswordAndCreateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');
    const salt=user.salt;
    const hashedPass=user.password

    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

    if (hashedPass !== userProvidedHash) {
        console.log('Password mismatch');
        console.log('Provided:', userProvidedHash);
        console.log('Expected:', user.hashedPass);
        throw new Error('Incorrect password');
    }
    const token=createTokenforUser(user);
    return token
});

const userModel = model('user', userSchema);

module.exports = userModel;
