import { getEmailTemplate } from "../../models/helpers";
import { deleteOtps, deleteUserSession, revokePreviousEmailTokens, saveEmailToken, saveOtp, updateAdminSession, updatePassword, updatePreviousPasswords, updateUserLastLoggedIn, useEmailToken, useOtp, validateOtp, } from "../../models/helpers/auth";
import { COOKIE_DOMAIN, COOKIE_SAME_SITE, COOKIE_SECURE, FRONTEND_URL, } from "../../setup/secrets";
import { LoginPayload, ProtectedPayload, ResetPasswordPayload, } from "../../types/auth";
import { RequestWithPayload, userRoles } from "../../types/utility";
import { generateOtp, sendResponse } from "../../utility/api";
import { generateJWTToken, generateRefreshToken, hashPassword } from "../../utility/auth";
import { emailQueue } from "../../utility/queue";
import { NextFunction, Response } from "express";
import moment from "moment";

const Login = (userType: userRoles) => async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { email, userId } = req.payload!;
    const { otp } = req.body;
    const origin = req.get("origin");

    const otpData = await validateOtp(userId, otp, transaction);
    if (!otpData) {
      await transaction.rollback();
      return sendResponse(res, 401, "Invalid otp");
    }

    await useOtp(userId, otp, transaction);

    const sessionId = await generateRefreshToken(20);
    const jwt = await generateJWTToken(userId, email, userType, sessionId);

    await updateUserLastLoggedIn(userId, transaction);
    await updateAdminSession(userId, sessionId, transaction);

    res.cookie(`${userType.toUpperCase()}_SESSION_TOKEN`, jwt, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: COOKIE_SAME_SITE as "lax" | "strict" | "none",
      secure: COOKIE_SECURE === "true" ? true : false,

      ...(origin === "https://localhost:1573"
        ? {}
        : { domain: COOKIE_DOMAIN }),
    });

    await transaction.commit();

    sendResponse(res, 200, "User logged in successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const SendOtp = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { email, userId } = req.payload!;

    const otp = await generateOtp();

    await deleteOtps(userId, transaction);
    await saveOtp(userId, otp, transaction);

    const emailTemplate = await getEmailTemplate("otp", transaction);
    if (!emailTemplate) {
      await transaction.rollback();
      return sendResponse(res, 500, "Email template not found");
    }

    const html = emailTemplate.replace(`{%otp%}`, otp);
    const subject = "OSP - One time password";

    emailQueue.push({ to: email, subject, html, retry: 0 });

    await transaction.commit();

    sendResponse(res, 200, "Otp sent successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const ForgotPassword = async (req: RequestWithPayload<LoginPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { email, userId } = req.payload!;
    const emailToken = await generateRefreshToken(30);

    const content = await getEmailTemplate("forgot-password", transaction);
    if (!content) {
      await transaction.rollback();
      return sendResponse(res, 500, "Email template not found");
    }

    const expiry = moment().add(30, "minutes").toDate().toISOString();
    const redirectUri = `${FRONTEND_URL}/auth/reset-password?token=${emailToken}&expiry=${expiry}`;
    console.log("Redirect URI:", redirectUri);
    const html = content.replace('{%reset-password-url%}', redirectUri);
    const subject = "Forgot Password";

    await revokePreviousEmailTokens(userId, 'reset-password', transaction);

    await saveEmailToken(userId, emailToken, 'reset-password', transaction);

    emailQueue.push({ to: email, subject: subject, html: html, retry: 0 });

    await transaction.commit();

    sendResponse(res, 200, "Forgot password request sent successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const ResetPassword = async (req: RequestWithPayload<ResetPasswordPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { emailToken, password } = req.body;
    const { userId } = req.payload!;

    await useEmailToken(userId, emailToken, "reset-password", transaction);

    const hashedPassword = await hashPassword(password);
    await updatePassword(userId, hashedPassword, transaction);

    await updatePreviousPasswords(userId, hashedPassword, transaction);

    await transaction.commit();

    sendResponse(res, 200, "Password reset successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const SetPassword = async (req: RequestWithPayload<ResetPasswordPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { emailToken, password } = req.body;
    const { userId } = req.payload!;

    await useEmailToken(userId, emailToken, "set-password", transaction);

    const hashedPassword = await hashPassword(password);
    await updatePassword(userId, hashedPassword, transaction);

    await updatePreviousPasswords(userId, hashedPassword, transaction);

    await transaction.commit();

    sendResponse(res, 200, "Password set successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const Logout = (userType: userRoles) => async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { userId } = req.payload!;
    const origin = req.get("origin");

    res.clearCookie(`${userType.toUpperCase()}_SESSION_TOKEN`, {
      httpOnly: true,
      sameSite: COOKIE_SAME_SITE as "lax" | "strict" | "none", // For sameSite: none, we need secure true for it to work on chrome
      secure: COOKIE_SECURE === "true" ? true : false,
      ...(origin === "https://localhost:5173"
        ? {}
        : { domain: COOKIE_DOMAIN }),
    });

    if (userType === "admin") {
      await deleteUserSession(userId, transaction);
    }

    await transaction.commit();

    sendResponse(res, 200, "User logged out successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const ChangePassword = async (req: RequestWithPayload<ProtectedPayload>, res: Response, next: NextFunction) => {
  const transaction = req.transaction!;
  try {
    const { userId } = req.payload!;
    const password = req.body.password;

    const hash = await hashPassword(password);
    await updatePassword(userId, hash, transaction);

    await updatePreviousPasswords(userId, hash, transaction);

    await transaction.commit();

    sendResponse(res, 200, "Password changed successfully");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export {
  SendOtp,
  Login,
  ForgotPassword,
  ResetPassword,
  SetPassword,
  Logout,
  ChangePassword,
};
