import { getEmailTemplate } from "../../models/helpers";
import { revokePreviousEmailTokens, saveEmailToken } from "../../models/helpers/auth";
import { changeUserActivation, createUser, deleteUser, editUser, getUserDetails, getUserList } from "../../models/helpers/staff";
import { FRONTEND_URL } from "../../setup/secrets";
import { ProtectedPayload } from "../../types/auth"
import { CreateStaffUserPayload } from "../../types/staff";
import { RequestWithPayload } from "../../types/utility"
import { sendResponse } from "../../utility/api";
import { generateRefreshToken } from "../../utility/auth";
import { emailQueue } from "../../utility/queue";
import { NextFunction, Response } from "express"
import moment from "moment";


const CreateStaffUser = async (req: RequestWithPayload<CreateStaffUserPayload & ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { firstName, lastName, email, phone, roleId } = req.body;
        const userId = req.payload!.userId;

        const user = await createUser(userId, email, roleId, null, firstName, lastName, phone, transaction);

        const emailToken = await generateRefreshToken(30);
        const content = await getEmailTemplate('set-password', transaction)
        if (!content) {
            throw new Error('set-password - Email template not found')
        }

        const expiry = moment().add(2, 'days').toDate().toISOString();
        const redirectUri = `${FRONTEND_URL}/set-password?token=${emailToken}&expiry=${expiry}`;
        const html = content.replace('{%set-password-url%}', redirectUri);
        const subject = 'Set Password';

        await revokePreviousEmailTokens(user.id, 'set-password', transaction)

        await saveEmailToken(user.id, emailToken, 'set-password', transaction);

        emailQueue.push({ to: email, subject, html, retry: 0 });

        await transaction.commit();



        sendResponse(res, 201, 'User created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error)
    }
}

const EditStaffUser = async (req: RequestWithPayload<CreateStaffUserPayload & ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params.id;

        const { firstName, lastName, email, phone } = req.body;
        const userId = req.payload!.userId;

        await editUser(userId, email, firstName, lastName, phone, transaction);

        await transaction.commit();

        sendResponse(res, 200, 'User edited successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

const DeleteStaffUser = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params.id;
        const userId = req.payload!.userId;

        await deleteUser(id, userId, transaction);

        await transaction.commit();

        sendResponse(res, 200, 'User deleted successfully');
    } catch (error) {

        await transaction.rollback();
        next(error);
    }
}

const ChangeStaffUserActivation = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;
        const userId = req.payload!.userId;
        const { active } = req.body;

        await changeUserActivation(id, active, userId, transaction);

        await transaction.commit();


        sendResponse(res, 200, `User ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {

        await transaction.rollback();
        next(error);
    }
}

const GetStaffUserDetails = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const id = req.params!.id;

        const details = await getUserDetails('admin', id, transaction);
        if (!details) {
            await transaction.rollback();
            return sendResponse(res, 404, 'User not found');
        }

        await transaction.commit();

        sendResponse(res, 200, 'User details fetched successfully', details);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

const GetStaffUserList = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
    const transaction = req.transaction!;
    try {
        const { size, page, search, sortKey, sortDir } = req.query;
        const offset = Number(size) * (Number(page) - 1);

        const list = await getUserList("admin", Number(size), offset, sortKey ? String(sortKey) : null, sortDir as 'ASC' | 'DESC' | null, search ? String(search) : null, transaction);

        await transaction.commit();

        sendResponse(res, 200, 'User list fetched successfully', list);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export {
    CreateStaffUser,
    EditStaffUser,
    DeleteStaffUser,
    ChangeStaffUserActivation,
    GetStaffUserDetails,
    GetStaffUserList
}