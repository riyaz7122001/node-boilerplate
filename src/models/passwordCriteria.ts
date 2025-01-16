import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

interface PasswordCriteriaAttributes {
    id: number;
    minChars: number;
    maxChars: number;
    allowedSpecialChars?: string | null;
    containsUpperCase: boolean;
    containsLowerCase: boolean;
    isAlphaNumeric: boolean;
    resetPasswordDays: number;
    isResetPasswordDays: boolean;
    is2faEnabled?: boolean;
    previousPasswordReuseCount: number;
    isPreviousPasswordReuseCount: boolean;
    idleTimeForLogout: number;
    isIdleTimeForLogout: boolean;
    monthsInactivityBeforeExpiring: number;
    isMonthsInactivityBeforeExpiring: boolean;
    updatedOn?: Date;
    updatedBy?: string;
}

interface PasswordCriteriaCreationAttributes
    extends Optional<PasswordCriteriaAttributes, 'id'> { }

interface PasswordCriteriaInstance
    extends Model<PasswordCriteriaAttributes, PasswordCriteriaCreationAttributes>,
    PasswordCriteriaAttributes { };

const passwordCriteria = sequelize.define<PasswordCriteriaInstance>(
    'passwordCriteria',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        minChars: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        maxChars: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        allowedSpecialChars: {
            type: DataTypes.STRING(50),
        },
        containsUpperCase: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        containsLowerCase: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        isAlphaNumeric: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        resetPasswordDays: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        isResetPasswordDays: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        previousPasswordReuseCount: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        isPreviousPasswordReuseCount: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        idleTimeForLogout: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        isIdleTimeForLogout: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        monthsInactivityBeforeExpiring: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        isMonthsInactivityBeforeExpiring: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        is2faEnabled: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        updatedOn: {
            type: DataTypes.DATE,
        },
        updatedBy: {
            type: DataTypes.UUID,
        },
    },
    {
        tableName: 'passwordCriteria',
        timestamps: false,
    }
);

export default passwordCriteria;
