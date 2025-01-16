"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.userOtp = exports.tokenType = exports.module = exports.emailTemplate = exports.token = void 0;
const emailTemplate_1 = __importDefault(require("./emailTemplate"));
exports.emailTemplate = emailTemplate_1.default;
const token_1 = __importDefault(require("./token"));
exports.token = token_1.default;
const tokenType_1 = __importDefault(require("./tokenType"));
exports.tokenType = tokenType_1.default;
const userOtp_1 = __importDefault(require("./userOtp"));
exports.userOtp = userOtp_1.default;
const user_1 = __importDefault(require("./user"));
exports.user = user_1.default;
const role_1 = __importDefault(require("./role"));
role_1.default.hasOne(user_1.default, {
    foreignKey: 'roleId',
});
user_1.default.belongsTo(role_1.default, {
    foreignKey: 'roleId',
});
user_1.default.hasMany(token_1.default, {
    foreignKey: 'userId',
});
token_1.default.belongsTo(user_1.default, {
    foreignKey: 'userId',
});
token_1.default.belongsTo(tokenType_1.default, {
    foreignKey: 'typeId',
});
tokenType_1.default.hasMany(token_1.default, {
    foreignKey: 'typeId',
});
