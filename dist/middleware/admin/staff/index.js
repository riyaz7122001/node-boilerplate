"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEditStaff = exports.ValidateStaffUserId = exports.ValidateCreateStaff = void 0;
const staff_1 = require("../../../models/helpers/staff");
const api_1 = require("../../../utility/api");
const ValidateCreateStaff = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const staffByEmail = await (0, staff_1.getUserByEmail)(email, null, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const staffByPhone = await (0, staff_1.getUserByPhone)('admin', phone, null, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Phone number already exists');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating creation');
    }
};
exports.ValidateCreateStaff = ValidateCreateStaff;
const ValidateEditStaff = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { email, phone } = req.body;
        const userId = req.params.id;
        const staffByEmail = await (0, staff_1.getUserByEmail)(email, userId, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Email already exists');
        }
        const staffByPhone = await (0, staff_1.getUserByPhone)('admin', phone, userId, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, 'Phone number already exists');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating edit');
    }
};
exports.ValidateEditStaff = ValidateEditStaff;
const ValidateStaffUserId = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const id = req.params.id;
        const user = await (0, staff_1.getUserById)(id, false, transaction);
        if (!user) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 404, 'User not found');
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        return (0, api_1.sendResponse)(res, 500, 'Error while validating user id');
    }
};
exports.ValidateStaffUserId = ValidateStaffUserId;
