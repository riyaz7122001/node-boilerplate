"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidationRules = exports.ResetPasswordValidationRules = exports.ForgotPasswordValidationRules = exports.TokenValidationRules = exports.LoginValidationRules = void 0;
const express_validator_1 = require("express-validator");
const LoginValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
    ];
};
exports.LoginValidationRules = LoginValidationRules;
const TokenValidationRules = () => {
    return [
        (0, express_validator_1.body)('refreshToken')
            .not().isEmpty().withMessage('Refresh Token is required').bail()
            .isHexadecimal().withMessage('Refresh Token must be a valid hexadecimal string')
            .trim(),
    ];
};
exports.TokenValidationRules = TokenValidationRules;
const ForgotPasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .normalizeEmail()
            .trim(),
    ];
};
exports.ForgotPasswordValidationRules = ForgotPasswordValidationRules;
const ResetPasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters').bail()
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
        (0, express_validator_1.body)('emailToken')
            .not().isEmpty().withMessage('Email Token is required').bail()
            .isHexadecimal().withMessage('Provide a valid email token')
            .trim(),
    ];
};
exports.ResetPasswordValidationRules = ResetPasswordValidationRules;
const ChangePasswordValidationRules = () => {
    return [
        (0, express_validator_1.body)('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isString().withMessage('Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 to 20 characters')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must contain atleast one lowercase, uppercase, number and special characters'),
        (0, express_validator_1.body)('newPassword')
            .not().isEmpty().withMessage('New Password is required').bail()
            .isString().withMessage('New Password must be of type String').bail()
            .isLength({ min: 6, max: 20 }).withMessage('New Password must be between 6 to 20 characters')
            .isStrongPassword({ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('New Password must contain atleast one lowercase, uppercase, number and special characters'),
    ];
};
exports.ChangePasswordValidationRules = ChangePasswordValidationRules;
