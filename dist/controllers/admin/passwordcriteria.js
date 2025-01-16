"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPasswordCriteria = exports.GetPasswordCriteria = void 0;
const passwordcriteria_1 = require("@models/helpers/passwordcriteria");
const api_1 = require("@utility/api");
const GetPasswordCriteria = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const criteria = await (0, passwordcriteria_1.getPasswordCriteria)(transaction);
        if (!criteria) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'Password criteria not found');
        }
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Password criteria fetched successfully', criteria);
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.GetPasswordCriteria = GetPasswordCriteria;
const EditPasswordCriteria = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const userId = req.payload.userId;
        const { minLength, maxLength, allowedSpecialChars, containsUpperCase, is2faEnabled, containsLowerCase, isAlphaNumeric, resetPasswordDays, previousPasswordReuseCount, idleTimeForLogout, monthsInactivityBeforeExpiring, isResetPasswordDays, isPreviousPasswordReuseCount, isIdleTimeForLogout, isMonthsInactivityBeforeExpiring } = req.body;
        await (0, passwordcriteria_1.updatePasswordCriteria)(minLength, maxLength, is2faEnabled, allowedSpecialChars, containsUpperCase, containsLowerCase, isAlphaNumeric, resetPasswordDays, previousPasswordReuseCount, idleTimeForLogout, monthsInactivityBeforeExpiring, isResetPasswordDays, isPreviousPasswordReuseCount, isIdleTimeForLogout, isMonthsInactivityBeforeExpiring, userId, transaction);
        await transaction.commit();
        (0, api_1.sendResponse)(res, 200, 'Password criteria updated successfully');
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.EditPasswordCriteria = EditPasswordCriteria;
