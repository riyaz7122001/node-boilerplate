import emailTemplate from "../../models/emailTemplate";
import user from "../../models/user";
import { Transaction } from "sequelize";


const getUserByEmail = async (email: string, deleted: boolean, transaction: Transaction) => {
    const userData = await user.findOne({
        attributes: ['id', 'activationStatus', 'email', 'passwordHash', 'passwordSetOn'],
        where: { email, isDeleted: deleted }, transaction
    });
    return userData;
}

const getEmailTemplate = async (title: string, transaction: Transaction) => {
    const data = await emailTemplate.findOne({ where: { title: title }, transaction });
    return data?.content;
}


export { getUserByEmail, getEmailTemplate }