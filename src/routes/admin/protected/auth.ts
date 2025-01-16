import { GetUserProfile } from "../../../controllers/admin/auth";
import { ChangePassword, Logout } from "../../../controllers/common/auth";
import { ValidateChangePassword } from "../../../middleware/admin/auth";
import { ChangePasswordValidationRules } from "../../../middleware/admin/auth/validator";
import { ValidateReqParams } from "../../../middleware/common/validator";
import { Router } from "express";

const router = Router();

router.get('/logout', Logout('admin'));
router.get('/profile', GetUserProfile);
router.put('/change-password', ChangePasswordValidationRules(), ValidateReqParams, ValidateChangePassword, ChangePassword);

export default router;