import { ForgotPassword, Login, ResetPassword, SendOtp, SetPassword, } from "../../controllers/common/auth";
import { ValidateEmail, ValidateEmailToken, ValidatePassword, } from "../../middleware/admin/auth";
import { ForgotPasswordValidationRules, LoginValidationRules, ResetPasswordValidationRules, } from "../../middleware/admin/auth/validator";
import { ValidateReqParams } from "../../middleware/common/validator";
import { Router } from "express";

const router = Router();

router.post("/login", LoginValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, Login("admin"));
router.post("/otp", LoginValidationRules(), ValidateReqParams, ValidateEmail, ValidatePassword, SendOtp);
router.post("/forget-password", ForgotPasswordValidationRules(), ValidateReqParams, ValidateEmail, ForgotPassword);
router.post("/reset-password", ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken("reset-password"), ResetPassword);
router.post("/set-password", ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken("reset-password"), SetPassword);

export default router;
