import { getUserByEmail } from "../../../models/helpers";
import { getUserById, getUserDetailsFromToken, } from "../../../models/helpers/auth";
import sequelize from "../../../setup/database";
import { LoginPayload, ProtectedPayload, ResetPasswordPayload, } from "../../../types/auth";
import { RequestWithPayload, userRoles } from "../../../types/utility";
import { sendResponse } from "../../../utility/api";
import { decodeToken, validatePassword } from "../../../utility/auth";
import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Transaction } from "sequelize";

const ValidateEmail = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const email = req.body.email;

    const userDetails = await getUserByEmail(email, false, transaction);
    if (!userDetails) {
      await transaction.rollback();
      return sendResponse(res, 400, "User not found");
    }

    if (!userDetails.activationStatus) {
      await transaction.rollback();
      return sendResponse(res, 400, 'User is disabled');
    }

    req.payload = {
      userId: userDetails.id,
      email: email,
      passwordHash: userDetails.passwordHash,
      passwordSetOn: userDetails.passwordSetOn,
      roleId: userDetails.roleId
    }
    next();
  } catch (error) {
    await transaction.rollback();
    sendResponse(res, 500, "Internal Server Error");
  }
};

const ValidatePassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { passwordHash, passwordSetOn } = req.payload!;
    const { password } = req.body;

    if (!passwordHash || !passwordSetOn) {
      await transaction.rollback();
      return sendResponse(res, 403, "Password not set");
    }

    const isValid = await validatePassword(password, passwordHash);
    if (!isValid) {
      await transaction.rollback();
      return sendResponse(res, 401, "Invalid password");
    }

    req.payload = {
      ...req.payload!,
    };

    next();
  } catch (error) {
    await transaction.rollback();
    return sendResponse(res, 500, "Internal server error");
  }
};

const ValidateChangePassword = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { passwordHash } = req.payload!;
    const { oldPassword } = req.body;

    if (!passwordHash) {
      await transaction.rollback();
      return sendResponse(res, 403, "Password not set");
    }

    const isValid = await validatePassword(oldPassword, passwordHash);
    if (!isValid) {
      await transaction.rollback();
      return sendResponse(res, 401, "Password not set");
    }

    next();
  } catch (error) {
    await transaction.rollback();
    return sendResponse(res, 500, "Internal server error");
  }
};

const ValidateEmailToken = (tokenType: "reset-password" | "set-password") => async (req: RequestWithPayload<ResetPasswordPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const emailToken = req.body.emailToken;

    const details = await getUserDetailsFromToken(emailToken, tokenType, transaction);
    console.log("details", details);
    if (!details?.userId) {
      await transaction.rollback();
      return sendResponse(res, 401, "Invalid token");
    }

    req.payload = {
      userId: details.userId,
    };
    next();
  } catch (error) {
    await transaction.rollback();
    return sendResponse(res, 500, "Internal server error");
  }
};

const ValidateToken = (type: userRoles) => async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
  let transaction: Transaction | null = null;
  try {
    const token = req.cookies?.[`${type.toUpperCase()}_SESSION_TOKEN`];
    if (!token) {
      return sendResponse(res, 401, "Missing Session Token");
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = await decodeToken(token);
    } catch (error) {
      return sendResponse(res, 401, "Invalid token");
    }

    const claim = decodedToken?.claim;
    if (claim !== type) {
      return sendResponse(res, 403, "Invalid claim in token");
    }

    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    const user = await getUserById(decodedToken.id, false, true, transaction);
    if (!user) {
      await transaction.rollback();
      return sendResponse(res, 403, "Invalid user");
    }

    if (!user.activationStatus) {
      await transaction.rollback();
      return sendResponse(res, 403, "Your account has been disabled, please contact system administrator");
    }

    req.transaction = transaction;
    req.payload = {
      userId: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
    };

    next();
  } catch (error: any) {
    await transaction?.rollback();
    return sendResponse(res, 500, error?.message?.toString() || "Internal server error");
  }
};

export {
  ValidatePassword,
  ValidateEmail,
  ValidateEmailToken,
  ValidateToken,
  ValidateChangePassword,
};
