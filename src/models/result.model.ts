import { Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import Student from "./student.model";
import School from "./school.model";

interface StudentResultAttributes {
	id: string;

	studentRegNo: string;
	student?: Student;

	school?: School;
	schoolId: string;

	reading: number;
	writing: number;
	mathematics: number;
	total: number;
	position: number;
	year: string;
}

const userResult: StudentResultAttributes = {} as StudentResultAttributes;

interface StudentResultCreationAttributes
	extends Optional<
		StudentResultAttributes,
		"id" | "mathematics" | "position" | "reading" | "total" | "writing"
	> {}

@Table({ modelName: "StudentResult" })
class StudentResult extends Model<
	StudentResultAttributes,
	StudentResultCreationAttributes
> {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: typeof userResult.id;

	@ForeignKey(() => Student)
	@Column({ type: DataType.STRING, allowNull: false })
	declare studentRegNo: typeof userResult.studentRegNo;

	@BelongsTo(() => Student)
	declare student: Student;

	@ForeignKey(() => School)
	@Column({ type: DataType.UUID })
	declare schoolId: typeof userResult.schoolId;

	@BelongsTo(() => School)
	declare school: School;

	@Column({ type: DataType.NUMBER })
	declare reading: typeof userResult.reading;

	@Column({ type: DataType.NUMBER })
	declare writing: typeof userResult.writing;

	@Column({ type: DataType.NUMBER })
	declare mathematics: typeof userResult.mathematics;

	@Column({ type: DataType.NUMBER })
	declare total: typeof userResult.total;

	@Column({ type: DataType.NUMBER })
	declare position: typeof userResult.position;

	@Column({ type: DataType.STRING })
	declare year: typeof userResult.year;
}

export default StudentResult;
