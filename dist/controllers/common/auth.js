"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = exports.Logout = exports.SetPassword = exports.ResetPassword = exports.ForgotPassword = exports.Login = exports.SendOtp = void 0;
const helpers_1 = require("../../models/helpers");
const auth_1 = require("../../models/helpers/auth");
const secrets_1 = require("../../setup/secrets");
const api_1 = require("../../utility/api");
const auth_2 = require("../../utility/auth");
const queue_1 = require("../../utility/queue");
const moment_1 = __importDefault(require("moment"));
const Login = (userType) => async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, userId } = req.payload;
        const { otp } = req.body;
        const origin = req.get("origin");
        const otpData = await (0, auth_1.validateOtp)(userId, otp, transaction);
        if (!otpData) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid otp");
        }
        await (0, auth_1.useOtp)(userId, otp, transaction);
        const sessionId = await (0, auth_2.generateRefreshToken)(20);
        const jwt = await (0, auth_2.generateJWTToken)(userId, email, userType, sessionId);
        await (0, auth_1.updateUserLastLoggedIn)(userId, transaction);
        await (0, auth_1.updateAdminSession)(userId, sessionId, transaction);
        res.cookie(`${userType.toUpperCase()}_SESSION_TOKEN`, jwt, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: secrets_1.COOKIE_SAME_SITE,
            secure: secrets_1.COOKIE_SECURE === "true" ? true : false,
            ...(origin === "https://localhost:1573"
                ? {}
                : { domain: secrets_1.COOKIE_DOMAIN }),
        });
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "User logged in successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.Login = Login;
const SendOtp = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, userId } = req.payload;
        const otp = await (0, api_1.generateOtp)();
        await (0, auth_1.deleteOtps)(userId, transaction);
        await (0, auth_1.saveOtp)(userId, otp, transaction);
        const emailTemplate = await (0, helpers_1.getEmailTemplate)("otp", transaction);
        if (!emailTemplate) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 500, "Email template not found");
        }
        const html = emailTemplate.replace(`{%otp%}`, otp);
        const subject = "OSP - One time password";
        queue_1.emailQueue.push({ to: email, subject, html, retry: 0 });
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Otp sent successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.SendOtp = SendOtp;
const ForgotPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, userId } = req.payload;
        const emailToken = await (0, auth_2.generateRefreshToken)(30);
        const content = await (0, helpers_1.getEmailTemplate)("forgot-password", transaction);
        if (!content) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 500, "Email template not found");
        }
        const expiry = (0, moment_1.default)().add(30, "minutes").toDate().toISOString();
        const redirectUri = `${secrets_1.FRONTEND_URL}/auth/reset-password?token=${emailToken}&expiry=${expiry}`;
        console.log("Redirect URI:", redirectUri);
        const html = content.replace('{%reset-password-url%}', redirectUri);
        const subject = "Forgot Password";
        await (0, auth_1.revokePreviousEmailTokens)(userId, 'reset-password', transaction);
        await (0, auth_1.saveEmailToken)(userId, emailToken, 'reset-password', transaction);
        queue_1.emailQueue.push({ to: email, subject: subject, html: html, retry: 0 });
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Forgot password request sent successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { emailToken, password } = req.body;
        const { userId } = req.payload;
        await (0, auth_1.useEmailToken)(userId, emailToken, "reset-password", transaction);
        const hashedPassword = await (0, auth_2.hashPassword)(password);
        await (0, auth_1.updatePassword)(userId, hashedPassword, transaction);
        await (0, auth_1.updatePreviousPasswords)(userId, hashedPassword, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Password reset successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ResetPassword = ResetPassword;
const SetPassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { emailToken, password } = req.body;
        const { userId } = req.payload;
        await (0, auth_1.useEmailToken)(userId, emailToken, "reset-password", transaction);
        const hashedPassword = await (0, auth_2.hashPassword)(password);
        await (0, auth_1.updatePassword)(userId, hashedPassword, transaction);
        await (0, auth_1.updatePreviousPasswords)(userId, hashedPassword, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Password set successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.SetPassword = SetPassword;
const Logout = (userType) => async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        const origin = req.get("origin");
        res.clearCookie(`${userType.toUpperCase()}_SESSION_TOKEN`, {
            httpOnly: true,
            sameSite: secrets_1.COOKIE_SAME_SITE, // For sameSite: none, we need secure true for it to work on chrome
            secure: secrets_1.COOKIE_SECURE === "true" ? true : false,
            ...(origin === "https://localhost:5173"
                ? {}
                : { domain: secrets_1.COOKIE_DOMAIN }),
        });
        if (userType === "admin") {
            await (0, auth_1.deleteUserSession)(userId, transaction);
        }
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "User logged out successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.Logout = Logout;
const ChangePassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { userId } = req.payload;
        const password = req.body.password;
        const hash = await (0, auth_2.hashPassword)(password);
        await (0, auth_1.updatePassword)(userId, hash, transaction);
        await (0, auth_1.updatePreviousPasswords)(userId, hash, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, "Password changed successfully");
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.ChangePassword = ChangePassword;
