"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.hashPassword = exports.generateJWTToken = exports.generateRefreshToken = exports.validatePassword = void 0;
const secrets_1 = require("../setup/secrets");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const validatePassword = async (password, passwordHash) => {
    return await (0, bcrypt_1.compare)(password, passwordHash);
};
exports.validatePassword = validatePassword;
const generateRefreshToken = (size) => {
    return new Promise((resolve, reject) => {
        (0, crypto_1.randomBytes)(size, (err, buf) => {
            if (err) {
                reject(err);
            }
            resolve(buf.toString('hex'));
        });
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateJWTToken = (userId, email, claim, sessionId) => {
    const data = {
        id: userId,
        email: email,
        claim,
        sessionId
    };
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.sign)(data, secrets_1.JWT_SECRET, {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) {
                reject(err);
            }
            if (token) {
                resolve(token);
            }
            reject(`Token generation failed`);
        });
    });
};
exports.generateJWTToken = generateJWTToken;
const hashPassword = async (password) => {
    const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const decodeToken = (token) => {
    if (!token) {
        throw new Error('Missing token');
    }
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secrets_1.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
};
exports.decodeToken = decodeToken;
