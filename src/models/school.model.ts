import { Optional } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import Student from "./student.model";
import StudentResult from "./result.model";

interface SchoolAttributes {
	id: string;
	name: string;
	results: StudentResult[];
	students: Student[];
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

	@HasMany(() => StudentResult)
	declare results: StudentResult[];

	@HasMany(() => Student)
	declare students: Student[];

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default School;
