import { Optional } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import User from "./user.model";
import UserResult from "./result.model";

interface SchoolAttributes {
	id: string;
	name: string;
	results: UserResult[];
	students: User[];
}

const school: SchoolAttributes = {} as SchoolAttributes;

interface SchoolCreationAttributes
	extends Optional<SchoolAttributes, "id" | "results" | "students"> {}

@Table({ modelName: "School" })
class School extends Model<SchoolAttributes, SchoolCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: typeof school.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: typeof school.name;

	@HasMany(() => UserResult)
	declare results: UserResult[];

	@HasMany(() => User)
	declare students: User[];

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default School;
