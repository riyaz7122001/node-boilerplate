import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

interface EmailTemplateAttributes {
    id: number;
    title: string;
    content: string;
}

interface EmailTemplateCreationAttributes
    extends Optional<EmailTemplateAttributes, 'id'> { }

interface EmailTemplateInstance
    extends Model<EmailTemplateAttributes, EmailTemplateCreationAttributes>,
    EmailTemplateAttributes { }

const emailTemplate = sequelize.define<EmailTemplateInstance>(
    'emailTemplates',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(50),
        },
        content: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: 'emailTemplates',
        timestamps: false,
    }
);

export default emailTemplate;
