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
import Event from "./event.model";

/* 
  id           String  @id @default(uuid())

  student      Student @relation(fields: [studentRegNo], references: [registrationNumber])
  studentRegNo String
  
  school       School  @relation(fields: [schoolId], references: [id])
  schoolId     String
  
  event        Event   @relation(fields: [eventId], references: [id])
  eventId      String
  
  reading      Int
  writing      Int
  mathematics  Int
  total        Int
  position     Int
*/

interface StudentResultAttributes {
	id: string;

	student?: Student; // @relation(fields: [studentRegNo], references: [registrationNumber])
	studentRegNo: string;

	school?: School; // @relation(fields: [schoolId], references: [id])
	schoolId: string;

	event?: Event; // @relation(fields: [eventId], references: [id])
	eventId: String;

	reading: number;
	writing: number;
	mathematics: number;
	total: number;
	position: number;
	// year: string;
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

	@BelongsTo(() => Student)
	declare student: Student;

	@ForeignKey(() => Student)
	@Column({ type: DataType.STRING, allowNull: false })
	declare studentRegNo: typeof userResult.studentRegNo;

	@BelongsTo(() => School)
	declare school: School;

	@ForeignKey(() => School)
	@Column({ type: DataType.UUID })
	declare schoolId: typeof userResult.schoolId;

	@BelongsTo(() => Event)
	declare event: Event;

	@ForeignKey(() => Event)
	@Column({ type: DataType.UUID })
	declare eventId: typeof userResult.eventId;

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

	// @Column({ type: DataType.STRING })
	// declare year: typeof userResult.year;
}

// export default StudentResult;
