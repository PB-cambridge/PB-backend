import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AdminAttributes {
	id: string;
	email: string;
	password: string;
	photo: string;
	createdAt: Date;
	updatedAt: Date;
}

const admin: AdminAttributes = {} as AdminAttributes;

interface AdminCreationAttributes
	extends Optional<
		AdminAttributes,
		"id" | "createdAt" | "updatedAt" | "photo"
	> {}

@Table({ modelName: "Admin" })
class Admin extends Model<AdminAttributes, AdminCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: typeof admin.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare email: typeof admin.email;

	@Column({ type: DataType.STRING, allowNull: false })
	declare password: typeof admin.password;

	@Column({ type: DataType.STRING })
	declare photo: typeof admin.photo;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default Admin;
