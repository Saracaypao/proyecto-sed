const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    correo: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    hashedContrasena: {
        type: String,
        trim: true,
        required: true,
    },
    salt: {
        type: String,
    },
    tokens: {
        type: [String],
        default: [],
    },
    roles: {
        type: [String],
        default: []
    },
}, { timestamps: true });

userSchema.methods = {
    encryptContrasena: function (contrasena) {
        if (!contrasena) return '';

        try {
            const encryptedContrasena = crypto.pbkdf2Sync(
                contrasena,
                this.salt,
                1000,
                64,
                'sha512'
            ).toString('hex');

            return encryptedContrasena;
        } catch (error) {
            console.error(error);
            return '';
        }
    },
    makeSalt: function () {
        return crypto.randomBytes(16).toString('hex');
    },
    compareContrasena: function (contrasena) {
        return this.hashedContrasena === this.encryptContrasena(contrasena);
    },
};

userSchema.virtual('contrasena').set(function (contrasena) {
    if (!contrasena) return;

    this.salt = this.makeSalt();
    this.hashedContrasena = this.encryptContrasena(contrasena);
});

module.exports = mongoose.model('Usuario', userSchema);
