import { getUserProflie } from "../../models/helpers/auth";
import { ProtectedPayload } from "../../types/auth";
import { RequestWithPayload } from "../../types/utility";
import { sendResponse } from "../../utility/api";
import { NextFunction, Response } from "express";

const GetUserProfile = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { userId } = req.payload!;

        const profile = await getUserProflie(userId, transaction)
        if (!profile) {
            await transaction.rollback();
            return sendResponse(res, 404, 'Profile not found');
        }

        await transaction.commit();

        sendResponse(res, 200, 'Profile fetched successfully', profile);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export {
    GetUserProfile
}