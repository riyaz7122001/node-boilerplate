"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordCriteria = exports.getPreviousPasswords = exports.getPasswordCriteria = void 0;
const passwordCriteria_1 = __importDefault(require("@models/passwordCriteria"));
const userPassword_1 = __importDefault(require("@models/userPassword"));
const getPasswordCriteria = async (transaction) => {
    const criteria = await passwordCriteria_1.default.findOne({
        attributes: ['minChars', 'maxChars', 'allowedSpecialChars', 'containsUpperCase', 'containsLowerCase', 'isAlphaNumeric', 'resetPasswordDays', 'previousPasswordReuseCount', 'idleTimeForLogout', 'monthsInactivityBeforeExpiring', 'isResetPasswordDays', 'isPreviousPasswordReuseCount', 'isIdleTimeForLogout', 'isMonthsInactivityBeforeExpiring', 'is2faEnabled'],
        ...(transaction && { transaction })
    });
    return criteria;
};
exports.getPasswordCriteria = getPasswordCriteria;
const updatePasswordCriteria = async (minLength, maxLength, is2faEnabled, allowedSpecialChars, containsUpperCase, containsLowerCase, isAlphaNumeric, resetPasswordDays, previousPasswordReuseCount, idleTimeForLogout, monthsInactivityBeforeExpiring, isResetPasswordDays, isPreviousPasswordReuseCount, isIdleTimeForLogout, isMonthsInactivityBeforeExpiring, updatedBy, transaction) => {
    await passwordCriteria_1.default.update({
        minChars: minLength,
        maxChars: maxLength,
        containsUpperCase: containsUpperCase,
        containsLowerCase: containsLowerCase,
        isAlphaNumeric: isAlphaNumeric,
        resetPasswordDays: resetPasswordDays,
        previousPasswordReuseCount: previousPasswordReuseCount,
        idleTimeForLogout: idleTimeForLogout,
        monthsInactivityBeforeExpiring: monthsInactivityBeforeExpiring,
        updatedBy: updatedBy,
        updatedOn: new Date(),
        allowedSpecialChars: allowedSpecialChars,
        ...(typeof isResetPasswordDays === 'boolean' && { isResetPasswordDays }),
        ...(typeof isPreviousPasswordReuseCount === 'boolean' && { isPreviousPasswordReuseCount }),
        ...(typeof isIdleTimeForLogout === 'boolean' && { isIdleTimeForLogout }),
        ...(typeof isMonthsInactivityBeforeExpiring === 'boolean' && { isMonthsInactivityBeforeExpiring }),
        ...(typeof is2faEnabled === 'boolean' && { is2faEnabled })
    }, {
        where: {},
        transaction
    });
};
exports.updatePasswordCriteria = updatePasswordCriteria;
const getPreviousPasswords = async (userId, count) => {
    const passwords = await userPassword_1.default.findAll({
        attributes: ['passwordHash'],
        where: {
            userId: userId
        },
        order: [['createdOn', 'DESC']],
        limit: count
    });
    return passwords;
};
exports.getPreviousPasswords = getPreviousPasswords;
