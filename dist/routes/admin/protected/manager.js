"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staff_1 = require("../../../controllers/admin/staff");
const staff_2 = require("../../../middleware/admin/staff");
const validator_1 = require("../../../middleware/admin/staff/validator");
const validator_2 = require("../../../middleware/common/validator");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/create', (0, validator_1.CreateStaffValidationRules)(), validator_2.ValidateReqParams, staff_2.ValidateCreateStaff, staff_1.CreateStaffUser);
router.put('/edit/:id', (0, validator_1.EditStaffValidationRules)(), validator_2.ValidateReqParams, staff_2.ValidateStaffUserId, staff_2.ValidateEditStaff, staff_1.EditStaffUser);
router.delete('/delete/:id', (0, validator_2.IdValidationRules)(), validator_2.ValidateReqParams, staff_2.ValidateStaffUserId, staff_1.DeleteStaffUser);
router.put('/activation/:id', (0, validator_2.ActivationValidationRules)(), validator_2.ValidateReqParams, staff_2.ValidateStaffUserId, staff_1.ChangeStaffUserActivation);
router.get('/details/:id', (0, validator_2.IdValidationRules)(), validator_2.ValidateReqParams, staff_1.GetStaffUserDetails);
router.get('/list', (0, validator_1.StaffPaginationValidationRules)(), validator_2.ValidateReqParams, staff_1.GetStaffUserList);
exports.default = router;
