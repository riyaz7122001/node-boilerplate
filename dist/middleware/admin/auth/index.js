"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateChangePassword = exports.ValidateToken = exports.ValidateEmailToken = exports.ValidateEmail = exports.ValidatePassword = void 0;
const helpers_1 = require("../../../models/helpers");
const auth_1 = require("../../../models/helpers/auth");
const database_1 = __importDefault(require("../../../setup/database"));
const api_1 = require("../../../utility/api");
const auth_2 = require("../../../utility/auth");
const sequelize_1 = require("sequelize");
const ValidateEmail = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const email = req.body.email;
        const userDetails = await (0, helpers_1.getUserByEmail)(email, false, transaction);
        if (!userDetails) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "User not found");
        }
        if (!userDetails.activationStatus) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'User is disabled');
        }
        req.payload = {
            userId: userDetails.id,
            email: email,
            passwordHash: userDetails.passwordHash,
            passwordSetOn: userDetails.passwordSetOn,
            roleId: userDetails.roleId
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 500, "Internal Server Error");
    }
};
exports.ValidateEmail = ValidateEmail;
const ValidatePassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { passwordHash, passwordSetOn } = req.payload;
        const { password } = req.body;
        if (!passwordHash || !passwordSetOn) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Password not set");
        }
        const isValid = await (0, auth_2.validatePassword)(password, passwordHash);
        if (!isValid) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid password");
        }
        req.payload = {
            ...req.payload,
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidatePassword = ValidatePassword;
const ValidateChangePassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { passwordHash } = req.payload;
        const { oldPassword } = req.body;
        if (!passwordHash) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Password not set");
        }
        const isValid = await (0, auth_2.validatePassword)(oldPassword, passwordHash);
        if (!isValid) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Password not set");
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidateChangePassword = ValidateChangePassword;
const ValidateEmailToken = (tokenType) => async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const emailToken = req.body.emailToken;
        const details = await (0, auth_1.getUserDetailsFromToken)(emailToken, tokenType, transaction);
        console.log("details", details);
        if (!details?.userId) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid token");
        }
        req.payload = {
            userId: details.userId,
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidateEmailToken = ValidateEmailToken;
const ValidateToken = (type) => async (req, res, next) => {
    let transaction = null;
    try {
        const token = req.cookies?.[`${type.toUpperCase()}_SESSION_TOKEN`];
        if (!token) {
            return (0, api_1.sendResponse)(res, 401, "Missing Session Token");
        }
        let decodedToken;
        try {
            decodedToken = await (0, auth_2.decodeToken)(token);
        }
        catch (error) {
            return (0, api_1.sendResponse)(res, 401, "Invalid token");
        }
        const claim = decodedToken?.claim;
        if (claim !== type) {
            return (0, api_1.sendResponse)(res, 403, "Invalid claim in token");
        }
        transaction = await database_1.default.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        const user = await (0, auth_1.getUserById)(decodedToken.id, false, true, transaction);
        if (!user) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Invalid user");
        }
        if (!user.activationStatus) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Your account has been disabled, please contact system administrator");
        }
        req.transaction = transaction;
        req.payload = {
            userId: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
        };
        next();
    }
    catch (error) {
        await transaction?.rollback();
        return (0, api_1.sendResponse)(res, 500, error?.message?.toString() || "Internal server error");
    }
};
exports.ValidateToken = ValidateToken;
