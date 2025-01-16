import token from "../../models/token";
import tokenType from "../../models/tokenType";
import user from "../../models/user";
import userActivity from "../../models/userActivity";
import userOtp from "../../models/userOtp";
import userPassword from "../../models/userPassword";
import moment from "moment";
import { Op } from "sequelize";
import { Transaction } from "sequelize";

const validateOtp = async (userId: string, otp: string, transaction: Transaction) => {
  const otpData = await userOtp.findOne({
    where: {
      userId,
      otp,
      createdOn: {
        [Op.gte]: moment().subtract(5, "minutes").toDate(),
      },
    },
    transaction,
  });

  return otpData;
};

const useOtp = async (userId: string, otp: string, transaction: Transaction) => {
  const count = await userOtp.destroy({
    where: {
      userId,
      otp,
    },
    transaction,
  });
  if (count === 0) {
    throw new Error("Unable to use otp");
  }
};

const deleteOtps = async (userId: string, transaction: Transaction) => {
  await userOtp.destroy({
    where: {
      userId,
    },
    transaction,
  });
};

const saveOtp = async (
  userId: string,
  otp: string,
  transaction: Transaction
) => {
  await userOtp.create(
    {
      userId,
      otp,
      createdOn: new Date(),
    },
    { transaction }
  );
};

const updateUserLastLoggedIn = async (userId: string, transaction: Transaction) => {
  await user.update(
    { lastLoggedInOn: new Date },
    {
      where: {
        id: userId,
      },
      transaction,
    }
  );
};

const updateAdminSession = async (userId: string, sessionId: string, transaction: Transaction) => {
  await user.update(
    { sessionId: sessionId },
    {
      where: {
        id: userId,
      },
      transaction,
    }
  );
};

const revokePreviousEmailTokens = async (userId: string, type: string, transaction: Transaction) => {
  const types = await tokenType.findOne({
    attributes: ["id"],
    where: { type: type, }
  });
  if (!types) {
    throw new Error("Token type not found");
  }

  await token.destroy({
    where: {
      userId: userId,
      typeId: types.id!,
    },
    transaction,
  });
};

const useEmailToken = async (userId: string, emailToken: string, type: string, transaction: Transaction) => {
  const types = await tokenType.findOne({
    attributes: ["id"],
    where: { type: type, },
    transaction,
  });
  if (!types) {
    throw new Error(`Token type not found`);
  }

  const count = await token.destroy({
    where: {
      userId: userId,
      token: emailToken,
      typeId: types.id!,
    },
    transaction,
  });
  if (count === 0) {
    throw new Error(`Unable to use token`);
  }
};

const saveEmailToken = async (userId: string, emailToken: string, type: string, transaction: Transaction) => {
  const types = await tokenType.findOne({
    attributes: ["id"],
    where: {
      type: type,
    },
    transaction,
  });
  console.log("types", types);
  if (!types) {
    throw new Error("Token type not found");
  }

  await token.create(
    {
      userId: userId,
      token: emailToken,
      typeId: types.id!,
      createdOn: new Date(),
    },
    { transaction }
  );
};

const getUserDetailsFromToken = async (emailToken: string, type: string, transaction: Transaction) => {
  const types = await tokenType.findOne({
    attributes: ["id"],
    where: {
      type: type,
    },
    transaction,
  });
  console.log("types", types);

  const result = await token.findOne({
    attributes: ['userId'],
    where: {
      token: emailToken,
      typeId: types?.id!,
      createdOn: {
        [Op.gte]: type === 'set-password' ? moment().subtract(2, 'days').toDate() : moment().subtract(30, 'minutes').toDate()
      }
    },
  });
  console.log('result', result);
  return result;
};

const updatePassword = async (userId: string, passwordHash: string, transaction: Transaction) => {
  const [count] = await user.update(
    {
      passwordHash: passwordHash,
      passwordSetOn: new Date(),
    },
    {
      where: {
        id: userId,
      },
      transaction,
    }
  );

  if (count === 0) {
    throw new Error("Could not update password");
  }
};

const updatePreviousPasswords = async (userId: string, passwordHash: string, transaction: Transaction) => {
  await userPassword.create(
    {
      userId: userId,
      passwordHash: passwordHash,
      createdOn: new Date(),
    },
    { transaction }
  );
};

const getUserProflie = async (userId: string, transaction: Transaction) => {
  const userData = await user.findOne({
    attributes: ["email", "firstName", "lastName", "phone"],
    where: {
      id: userId,
      isDeleted: false,
      activationStatus: true,
    },

    transaction,
  });
  return userData;
};

const getUserById = async (userId: number, deleted: boolean, activation: boolean | null, transaction: Transaction) => {
  const userData = await user.findOne({
    attributes: ["id", "activationStatus", "email", "passwordHash", "sessionId", "roleId"],
    where: {
      id: userId,
      isDeleted: deleted,
      ...(activation !== null && { activationStatus: activation })
    },
    transaction,
  });
  return userData;
};

const deleteUserSession = async (userId: string, transaction: Transaction) => {
  await user.update(
    { sessionId: null, },
    {
      where: { id: userId, },
      transaction,
    }
  );
};

export {
  saveOtp,
  validateOtp,
  updateUserLastLoggedIn,
  updateAdminSession,
  deleteOtps,
  revokePreviousEmailTokens,
  saveEmailToken,
  useEmailToken,
  getUserDetailsFromToken,
  useOtp,
  updatePassword,
  updatePreviousPasswords,
  getUserById,
  deleteUserSession,
  getUserProflie,
};
