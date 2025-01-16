import roles from "@models/role";
import user from "../../models/user";
import { Allows } from "../../types/staff";
import { userRoles } from "../../types/utility";
import { Op, Order } from "sequelize";
import { Transaction } from "sequelize";


const getUserByEmail = async (email: string, exceptionId: string | null, transaction: Transaction) => {
    const staff = await user.findOne({
        attributes: ['id'],
        where: {
            email,
            isDeleted: false,
            ...(exceptionId && { id: { [Op.ne]: exceptionId } }),
        },
        transaction
    });

    return staff;
}

const getUserByPhone = async (type: userRoles, phone: string, exceptionId: string | null, transaction: Transaction) => {
    const staff = await user.findOne({
        attributes: ['id'],
        where: {
            phone,
            isDeleted: false,
            ...(exceptionId && { id: { [Op.ne]: exceptionId } }),
        },
        transaction
    });

    return staff;
}


const createUser = async (createdBy: string | null, email: string, roleId: number, passwordHash: string | null, firstName: string, lastName: string, phone: string, transaction: Transaction) => {
    const data = await user.create({
        firstName,
        lastName,
        phone,
        email,
        roleId,
        createdOn: new Date(),
        createdBy,
        ...(passwordHash && {
            passwordHash,
            passwordSetOn: new Date()
        })
    }, { transaction });

    return data;
}


const editUser = async (userId: string, email: string, firstName: string, lastName: string, phone: string, transaction: Transaction) => {
    await user.update({
        email,
        firstName,
        lastName,
        phone
    }, {
        where: {
            id: userId
        },
        transaction
    });
}

const deleteUser = async (userId: string, deletedBy: string, transaction: Transaction) => {
    await user.update({
        isDeleted: true,
        deletedOn: new Date(),
        deletedBy
    }, {
        where: {
            id: userId
        },
        transaction
    });
}

const getUserById = async (userId: string, deleted: boolean, transaction: Transaction) => {
    const data = await user.findOne({
        where: {
            id: userId,
            isDeleted: deleted
        },
        transaction
    })
    return data;
}

const getUserDetails = async (userId: string, transaction: Transaction) => {
    const data = await user.findOne({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            id: userId,
            isDeleted: false
        },

    })
    return data;
}

const getUserList = async (limit: number, offset: number, sortKey: string | null, sortDir: 'ASC' | 'DESC' | null, search: string | null, transaction: Transaction) => {
    const searchCondition = search ? {
        [Op.or]: [
            { phone: { [Op.like]: `%${search}%` } },
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
        ]
    } : {};

    const sortColumn = sortKey && {
        'name': 'firstName',
        'phone': 'phone',
        'email': 'email',
        'active': 'activationStatus'

    }[sortKey];
    const sortOrder = sortColumn ? [[sortColumn, sortDir || 'DESC']] : [['createdOn', 'DESC']];

    const list = await user.findAndCountAll({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            isDeleted: false,
            ...searchCondition,
        },
        limit,
        offset,
        order: sortOrder as Order,
        transaction
    });

    return list;
}

const changeUserActivation = async (userId: string, isActive: boolean, updatedBy: string, transaction: Transaction) => {
    await user.update({
        activationStatus: isActive,
        activationStatusUpdatedOn: new Date(),
        activationStatusUpdatedBy: updatedBy
    }, {
        where: {
            id: userId
        },
        transaction
    });
}

const getRoleById = async (roleId: number, transaction: Transaction) => {
    const role = await roles.findOne({
        attributes: ['role'],
        where: { id: roleId },
        transaction
    });
    return role;
}

export {
    getUserByEmail,
    getUserByPhone,
    createUser,
    editUser,
    deleteUser,
    getUserById,
    getUserDetails,
    getUserList,
    changeUserActivation,
    getRoleById
}