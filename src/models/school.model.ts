import { Optional } from "sequelize";
import {
	BelongsToMany,
	Column,
	DataType,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import Student from "./student.model";
import StudentResult from "./result.model";
import Event from "./event.model";
import SchoolEvent from "./schoolEvent.model";

/* 
model School {
  id      String          @id @default(uuid())
  name    String
  results StudentResult[]

  students Student[]
  events   Event[]
}
*/
interface SchoolAttributes {
	id: string;
	name: string;

	results: StudentResult[];

	students: Student[];

	events: Event[];
}

const school: SchoolAttributes = {} as SchoolAttributes;

interface SchoolCreationAttributes
	extends Optional<
		SchoolAttributes,
		"id" | "results" | "students" | "events"
	> {}

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

	@BelongsToMany(() => Event, () => SchoolEvent)
	declare events: Event[];

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default School;
