"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const error_1 = require("./middleware/error");
const express_1 = __importDefault(require("./setup/express"));
const secrets_1 = require("./setup/secrets");
const routes_1 = __importDefault(require("./routes"));
express_1.default.use("/api/v1", routes_1.default);
express_1.default.use(error_1.errorHandler);
express_1.default.listen(secrets_1.PORT || 8080, () => {
    console.log(`Sever started on port ${secrets_1.PORT || 8080}`);
});
