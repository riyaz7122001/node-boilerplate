"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordcriteria_1 = require("@controllers/admin/passwordcriteria");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/details', passwordcriteria_1.GetPasswordCriteria);
exports.default = router;
