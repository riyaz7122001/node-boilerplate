"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPasswordCriteriaValidationRules = void 0;
const express_validator_1 = require("express-validator");
const EditPasswordCriteriaValidationRules = () => {
    return [
        (0, express_validator_1.body)('minLength')
            .not().isEmpty().withMessage('minLength is required').bail()
            .isInt({ min: 1, max: 30 }).withMessage('Minimum length must be a positive integer between 1 to 30'),
        (0, express_validator_1.body)('maxLength')
            .not().isEmpty().withMessage('maxLength is required').bail()
            .isInt({ min: 5, max: 100 }).withMessage('Maximum length must be a positive integer between 5 to 50'),
        (0, express_validator_1.body)('allowedSpecialChars')
            .optional({ values: 'null' })
            .isString().withMessage('Allowed special characters must be a string')
            .matches(/^[^a-zA-Z0-9]+$/).withMessage('allowedSpecialChars property must contain only special characters.'),
        (0, express_validator_1.body)('containsUpperCase')
            .not().isEmpty().withMessage('containsUpperCase is required').bail()
            .isBoolean({ strict: true }).withMessage('containsUpperCase must be of type Boolean').bail(),
        (0, express_validator_1.body)('containsLowerCase')
            .not().isEmpty().withMessage('containsLowerCase is required').bail()
            .isBoolean({ strict: true }).withMessage('containsLowerCase must be of type Boolean').bail(),
        (0, express_validator_1.body)('isAlphaNumeric')
            .not().isEmpty().withMessage('isAlphaNumeric is required').bail()
            .isBoolean({ strict: true }).withMessage('isAlphaNumeric must be of type Boolean').bail(),
        (0, express_validator_1.body)('resetPasswordDays')
            .not().isEmpty().withMessage('resetPasswordDays is required').bail()
            .isInt({ min: 1, max: 365 }).withMessage('resetPasswordDays must be a positive integer and less than 365'),
        (0, express_validator_1.body)('isResetPasswordDays')
            .optional({ values: 'falsy' })
            .isBoolean({ strict: true }).withMessage('isResetPasswordDays must be of type Boolean'),
        (0, express_validator_1.body)('previousPasswordReuseCount')
            .not().isEmpty().withMessage('previousPasswordReuseCount is required').bail()
            .isInt({ min: 1, max: 100 }).withMessage('previousPasswordReuseCount must be a positive integer and less than 100'),
        (0, express_validator_1.body)('isPreviousPasswordReuseCount')
            .optional({ values: 'falsy' })
            .isBoolean({ strict: true }).withMessage('isPreviousPasswordReuseCount must be of type Boolean'),
        (0, express_validator_1.body)('idleTimeForLogout')
            .not().isEmpty().withMessage('idleTimeForLogout is required').bail()
            .isInt({ min: 1, max: 60 }).withMessage('idleTimeForLogout must be a positive integer and less than 60'),
        (0, express_validator_1.body)('isIdleTimeForLogout')
            .optional({ values: 'falsy' })
            .isBoolean({ strict: true }).withMessage('isIdleTimeForLogout must be of type Boolean'),
        (0, express_validator_1.body)('monthsInactivityBeforeExpiring')
            .not().isEmpty().withMessage('monthsInactivityBeforeExpiring is required').bail()
            .isInt({ min: 1, max: 24 }).withMessage('monthsInactivityBeforeExpiring must be a positive integer and less than 24'),
        (0, express_validator_1.body)('isMonthsInactivityBeforeExpiring')
            .optional({ values: 'falsy' })
            .isBoolean({ strict: true }).withMessage('isMonthsInactivityBeforeExpiring must be of type Boolean'),
        (0, express_validator_1.body)('is2faEnabled')
            .optional({ values: 'falsy' })
            .isBoolean({ strict: true }).withMessage('is2faEnabled must be of type Boolean')
    ];
};
exports.EditPasswordCriteriaValidationRules = EditPasswordCriteriaValidationRules;
