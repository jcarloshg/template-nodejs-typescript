import { DataTypes, Model, Optional } from "sequelize";
import { PostgresManager } from "./postgres-manager";

// ─────────────────────────────────────
// init sequelize instance
// ─────────────────────────────────────

export const sequelize = PostgresManager.getInstance().getSequelize();

export interface MassageAttributes {
    uuid: string;
    senderuuid: string;
    content: string;
    created_at: Date;
}

interface MassageCreationAttributes extends Optional<MassageAttributes, "uuid"> { }

export class MessageProgress
    extends Model<MassageAttributes, MassageCreationAttributes>
    implements MassageAttributes {
    public uuid!: string;
    public senderuuid!: string;
    public content!: string;
    public created_at!: Date;
}

MessageProgress.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        senderuuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Message",
        tableName: "message",
        timestamps: false,
    }
);