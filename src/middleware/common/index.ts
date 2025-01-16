import sequelize from "../../setup/database";
import { WithTransaction } from "../../types/utility";
import { sendResponse } from "../../utility/api";
import { NextFunction, Response } from "express";
import { Transaction } from "sequelize";

const StartTransaction = async (req: WithTransaction, res: Response, next: NextFunction) => {
    try {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

        req.transaction = transaction;

        next();
    } catch (error) {
        sendResponse(res, 500, 'Error while beginning transaction');
    }
}

export {
    StartTransaction,
}