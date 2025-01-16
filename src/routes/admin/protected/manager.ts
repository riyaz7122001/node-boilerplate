import { ChangeStaffUserActivation, CreateStaffUser, DeleteStaffUser, EditStaffUser, GetStaffUserDetails, GetStaffUserList } from "../../../controllers/admin/staff";
import { ValidateCreateStaff, ValidateEditStaff, ValidateStaffUserId } from "../../../middleware/admin/staff";
import { CreateStaffValidationRules, EditStaffValidationRules, StaffPaginationValidationRules } from "../../../middleware/admin/staff/validator";
import { ActivationValidationRules, IdValidationRules, ValidateReqParams } from "../../../middleware/common/validator";
import { Router } from "express";

const router = Router();

router.post('/create', CreateStaffValidationRules(), ValidateReqParams, ValidateCreateStaff, CreateStaffUser);
router.put('/edit/:id', EditStaffValidationRules(), ValidateReqParams, ValidateStaffUserId, ValidateEditStaff, EditStaffUser)
router.delete('/delete/:id', IdValidationRules(), ValidateReqParams, ValidateStaffUserId, DeleteStaffUser);
router.put('/activation/:id', ActivationValidationRules(), ValidateReqParams, ValidateStaffUserId, ChangeStaffUserActivation);
router.get('/details/:id', IdValidationRules(), ValidateReqParams, GetStaffUserDetails)
router.get('/list', StaffPaginationValidationRules(), ValidateReqParams, GetStaffUserList)

export default router;
