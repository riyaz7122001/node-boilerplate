"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePasswordCriteria = void 0;
const passwordcriteria_1 = require("@models/helpers/passwordcriteria");
const api_1 = require("@utility/api");
const auth_1 = require("@utility/auth");
const ValidatePasswordCriteria = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const password = req.body.password;
        const userId = req.payload.userId;
        const criteria = await (0, passwordcriteria_1.getPasswordCriteria)(transaction);
        if (!criteria) {
            return next();
        }
        const { minChars, maxChars, containsLowerCase, containsUpperCase, isAlphaNumeric, previousPasswordReuseCount, allowedSpecialChars, isPreviousPasswordReuseCount } = criteria;
        if (password.length < minChars) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, `Password must be at least ${minChars} characters long`);
        }
        if (password.length > maxChars) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, `Password must be at most ${maxChars} characters long`);
        }
        if (containsLowerCase && !/[a-z]/.test(password)) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Password must contain at least one lowercase letter');
        }
        if (containsUpperCase && !/[A-Z]/.test(password)) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Password must contain at least one uppercase letter');
        }
        if (isAlphaNumeric && (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password))) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Password must contain at least one number and one letter');
        }
        if (allowedSpecialChars) {
            const specialChars = password.replace(/[a-zA-Z0-9]/g, '');
            for (const char of specialChars) {
                if (!allowedSpecialChars.includes(char)) {
                    await transaction.rollback();
                    return (0, api_1.sendResponse)(res, 400, `Password can only contain the following special characters: ${allowedSpecialChars}`);
                }
            }
        }
        if (isPreviousPasswordReuseCount) {
            const previousPasswords = await (0, passwordcriteria_1.getPreviousPasswords)(userId, previousPasswordReuseCount);
            for (const passwordHash of previousPasswords) {
                const match = await (0, auth_1.validatePassword)(password, passwordHash.passwordHash);
                if (match) {
                    await transaction.rollback();
                    return (0, api_1.sendResponse)(res, 400, `Password cannot be the same as any of the previous ${previousPasswordReuseCount} passwords`);
                }
            }
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Internal Server Error');
    }
};
exports.ValidatePasswordCriteria = ValidatePasswordCriteria;
