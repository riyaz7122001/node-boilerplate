import { WithTransaction } from "../../types/utility";
import { sendResponse } from "../../utility/api";
import { NextFunction, Response } from "express";
import { body, param, validationResult } from "express-validator";

const ValidateReqParams = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors: Record<string, any>[] = []
    errors.array().forEach(err => {
        if (err.type === 'field') {
            extractedErrors.push({ [err.path]: err.msg })
        }
    })

    const transaction = req.transaction;
    if (transaction) {
        await transaction.rollback();
    }

    sendResponse(res, 422, 'Invalid or missing parameters', [], extractedErrors);
}

const IdValidationRules = () => {
    return [
        param('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
    ]
}

const IdIntValidationRules = () => {
    return [
        param('id')
            .isInt({ min: 1 }).withMessage('Id must be of type Integer').bail(),
    ]
}

const ActivationValidationRules = () => {
    return [
        param('id')
            .isUUID().withMessage('Id must be of type UUID').bail(),
        body('active')
            .not().isEmpty().withMessage('Active is required').bail()
            .isBoolean({ strict: true }).withMessage('Active must be of type Boolean').bail(),
    ]
}

export { ValidateReqParams, IdValidationRules, IdIntValidationRules, ActivationValidationRules }