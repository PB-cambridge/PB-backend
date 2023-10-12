import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AdminAttributes {
	id: string;
	name: string;
	photo: string;
	createdAt: Date;
	updatedAt: Date;
}

const admin: AdminAttributes = {} as AdminAttributes;

interface AdminCreationAttributes
	extends Optional<AdminAttributes, "id" | "createdAt" | "updatedAt"> {}

@Table({ modelName: "Admin" })
class Admin extends Model<AdminAttributes, AdminCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: typeof admin.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: typeof admin.name;

	@Column({ type: DataType.STRING, allowNull: false })
	declare photo: typeof admin.photo;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default Admin;
