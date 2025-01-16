

import { body, param, query } from "express-validator"

const CreateStaffValidationRules = () => {
    return [
        body('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        body('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        body('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
        body('roleId')
            .not().isEmpty().withMessage('RoleId is required').bail()
            .isInt({ min: 1 }).withMessage('RoleId must be a positive integer'),

    ]
}

const EditStaffValidationRules = () => {
    return [
        param('id')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isUUID().withMessage('Id must be of type UUID').bail(),
        body('firstName')
            .not().isEmpty().withMessage('First Name is required').bail()
            .isString().withMessage('First Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('First Name can have max. 50 characters')
            .trim(),
        body('lastName')
            .not().isEmpty().withMessage('Last Name is required').bail()
            .isString().withMessage('Last Name must be of type String').bail()
            .isLength({ max: 50 }).withMessage('Last Name can have max. 50 characters')
            .trim(),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isLength({ max: 50 }).withMessage('Email must be max 50 characters').bail()
            .isEmail().withMessage('Provide a valid email')
            .toLowerCase()
            .normalizeEmail()
            .trim(),
        body('phone')
            .not().isEmpty().withMessage('Phone is required').bail()
            .isString().withMessage('Phone must be of type String').bail()
            .matches(/^\d{10}$/).withMessage('Provide a valid mobile number')
            .trim(),
        body('roleId')
            .not().isEmpty().withMessage('RoleId is required').bail()
            .isInt({ min: 1 }).withMessage('RoleId must be a positive integer'),

    ]
}

const StaffPaginationValidationRules = () => {
    return [
        query('size')
            .not().isEmpty().withMessage('Size is required').bail()
            .isInt({ min: 1, max: 100 }).withMessage('Size must be an Integer, between 1 and 100').bail()
            .toInt(),
        query('page')
            .not().isEmpty().withMessage('Page is required').bail()
            .isInt({ min: 1 }).withMessage('Page must be an Integer, greater than 0').bail()
            .toInt(),
        query('search')
            .optional({ values: 'falsy' })
            .toLowerCase()
            .trim(),
        query('sortKey')
            .optional({ values: 'falsy' })
            .isIn(['name', 'email', 'phone', 'role', 'active']).withMessage('SortKey should be one of name, email, phone, role, active')
            .trim(),
        query('sortDir')
            .optional({ values: 'falsy' })
            .isIn(['ASC', 'DESC']).withMessage('SortDir should be one of ASC, DESC')
            .trim(),
    ]
}

export {
    CreateStaffValidationRules,
    EditStaffValidationRules,
    StaffPaginationValidationRules
}