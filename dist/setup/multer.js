"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer = (sizeInMb) => (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: sizeInMb * 1024 * 1024
    }
});
exports.default = multer;