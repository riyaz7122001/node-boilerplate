"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = __importDefault(require("../models/role"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../utility/auth");
const createAdmin = async (firstName, lastName, phone, email, password) => {
    const hash = await (0, auth_1.hashPassword)(password);
    const role = await role_1.default.findOne({
        where: {
            role: 'admin'
        }
    });
    if (!role) {
        throw new Error('No role found: superadmin');
    }
    await user_1.default.create({
        firstName,
        lastName,
        phone,
        email,
        passwordHash: hash,
        createdOn: new Date(),
        passwordSetOn: new Date(),
        activationStatus: true,
        isDeleted: false,
        roleId: role.id,
    });
};
createAdmin("Riyaz", "Shaikh", "8169036093", "riyazshaikh7122001@gmail.com", "Admin@1234")
    .then(() => {
    console.log("Admin created successfully");
    process.exit(0);
})
    .catch((error) => {
    console.error("Error while creating super admin");
    console.error(error);
    process.exit(1);
});
