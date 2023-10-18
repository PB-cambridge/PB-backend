import { Optional } from "sequelize";
import {
	BelongsToMany,
	Column,
	DataType,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import School from "./school.model";
import Student from "./student.model";
import StudentResult from "./result.model";
import SchoolEvent from "./schoolEvent.model";

/* 
model Event {
  id              String          @id @default(uuid())
  title           String
  registrationFee Int
  description     String
  bannerImage     String
  location        String

  students        Student[]
  schools         School[]
  results         StudentResult[]

  dateTime        DateTime
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
 */
interface EventAttributes {
	id: string;
	title: string;
	registrationFee: number;
	description: string;
	bannerImage: string;
	location: string;

	students: Student[];
	schools: School[];
	results: StudentResult[];

	dateTime: Date;
	createdAt: Date;
	updatedAt: Date;
}

const event: EventAttributes = {} as EventAttributes;

interface EventCreationAttributes
	extends Optional<
		EventAttributes,
		"id" | "results" | "students" | "schools" | "createdAt" | "updatedAt"
	> {}

@Table({ modelName: "Event" })
class Event extends Model<EventAttributes, EventCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: typeof event.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare title: typeof event.title;

	@Column({ type: DataType.DOUBLE, allowNull: false })
	declare registrationFee: typeof event.registrationFee;

	@Column({ type: DataType.STRING, allowNull: false })
	declare description: typeof event.description;

	@Column({ type: DataType.STRING, allowNull: false })
	declare bannerImage: typeof event.bannerImage;

	@Column({ type: DataType.STRING, allowNull: false })
	declare location: typeof event.location;

	@HasMany(() => Student)
	declare students: Student[];

	@BelongsToMany(() => School, () => SchoolEvent)
	declare schools: School[];

	@HasMany(() => StudentResult)
	declare results: StudentResult[];

	@Column({ type: DataType.DATE, allowNull: false })
	declare dateTime: typeof event.dateTime;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default Event;
