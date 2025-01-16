import { getUserByEmail, getUserById, getUserByPhone } from "../../../models/helpers/staff";
import { WithTransaction } from "../../../types/utility";
import { sendResponse } from "../../../utility/api";
import { NextFunction, Response } from "express";

const ValidateCreateStaff = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, phone } = req.body;

        const staffByEmail = await getUserByEmail(email, null, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Email already exists');
        }

        const staffByPhone = await getUserByPhone('admin', phone, null, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Phone number already exists');
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating creation');
    }
}

const ValidateEditStaff = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { email, phone } = req.body;
        const userId = req.params.id!;

        const staffByEmail = await getUserByEmail(email, userId, transaction);
        if (staffByEmail) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Email already exists');
        }

        const staffByPhone = await getUserByPhone('admin', phone, userId, transaction);
        if (staffByPhone) {
            await transaction.rollback();
            return sendResponse(res, 400, 'Phone number already exists');
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating edit');
    }
}


const ValidateStaffUserId = async (req: WithTransaction, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params.id;

        const user = await getUserById(id, false, transaction);
        if (!user) {
            await transaction.rollback();
            return sendResponse(res, 404, 'User not found');
        }

        next();
    } catch (error) {
        await transaction.rollback();
        return sendResponse(res, 500, 'Error while validating user id');
    }
}

export {
    ValidateCreateStaff,
    ValidateStaffUserId,
    ValidateEditStaff,

}