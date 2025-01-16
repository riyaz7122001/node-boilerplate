import { ValidateCreateUser, ValidateEditUser, ValidateRoleById, ValidateUserId } from "@middleware/admin/staff";
import { ChangeUserActivation, CreateUser, DeleteUser, EditUser, GetUserDetails, GetUserList } from "@controllers/admin/staff";
import { CreateStaffValidationRules, EditStaffValidationRules, StaffPaginationValidationRules } from "../../../middleware/admin/staff/validator";
import { ActivationValidationRules, IdValidationRules, ValidateReqParams } from "../../../middleware/common/validator";
import { Router } from "express";
import { ResetPasswordValidationRules } from "@middleware/admin/auth/validator";
import { ValidateEmailToken } from "@middleware/admin/auth";
import { SetPassword } from "@controllers/common/auth";

const router = Router();

router.post('/create', CreateStaffValidationRules(), ValidateReqParams, ValidateCreateUser, ValidateRoleById, CreateUser);
router.put('/edit/:id', EditStaffValidationRules(), ValidateReqParams, ValidateUserId, ValidateEditUser, EditUser)
router.delete('/delete/:id', IdValidationRules(), ValidateReqParams, ValidateUserId, DeleteUser);
router.put('/activation/:id', ActivationValidationRules(), ValidateReqParams, ValidateUserId, ChangeUserActivation);
router.get('/details/:id', IdValidationRules(), ValidateReqParams, GetUserDetails)
router.get('/list', StaffPaginationValidationRules(), ValidateReqParams, GetUserList)
router.post("/set-password", ResetPasswordValidationRules(), ValidateReqParams, ValidateEmailToken("set-password"), SetPassword);

export default router;
