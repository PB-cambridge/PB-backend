import { Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import StudentResult from "./result.model";
import School from "./school.model";

interface StudentAttributes {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	phoneNumber: string;

	school?: School;
	schoolId?: string;

	level: "Junior" | "Senior" | "Graduated";
	scienceOrArt: "Science" | "Art";
	passport: string;

	results?: StudentResult[];
	whatsappNumber: string;
	registrationNumber: string;
	acknowledgementSent: boolean;
}

const student: StudentAttributes = {} as StudentAttributes;

interface StudentCreationAttributes
	extends Optional<
		StudentAttributes,
		| "id"
		| "acknowledgementSent"
		| "email"
		| "registrationNumber"
		// | "schoolId	"
		| "whatsappNumber"
	> {}

@Table({ modelName: "Student" })
class Student extends Model<StudentAttributes, StudentCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	declare id: typeof student.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare firstName: typeof student.firstName;

	@Column({ type: DataType.STRING, allowNull: false })
	declare lastName: typeof student.lastName;

	@Column({ type: DataType.STRING })
	declare email: typeof student.email;

	@Column({ type: DataType.STRING, allowNull: false })
	declare address: typeof student.address;

	@Column({ type: DataType.STRING })
	declare phoneNumber: typeof student.phoneNumber;

	@ForeignKey(() => School)
	@Column
	declare schoolId: string;

	@BelongsTo(() => School)
	declare school: School;

	@Column({
		type: DataType.ENUM("Junior", "Senior", "Graduated"),
		allowNull: false,
	})
	declare level: typeof student.level;

	@Column({ type: DataType.ENUM("Science", "Art"), allowNull: false })
	declare scienceOrArt: typeof student.scienceOrArt;

	@Column({ type: DataType.STRING, allowNull: false })
	declare passport: typeof student.passport;

	@HasMany(() => StudentResult)
	declare results: StudentResult[];

	@Column({ type: DataType.STRING })
	declare whatsappNumber: typeof student.whatsappNumber;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare registrationNumber: typeof student.registrationNumber;

	@Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
	declare acknowledgementSent: typeof student.acknowledgementSent;
}

export default Student;

export function generateRegistrationNumber(): string {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";

	let registrationNumber = "";

	// Generate three random letters
	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * letters.length);
		registrationNumber += letters[randomIndex];
	}

	// Generate four random numbers
	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * numbers.length);
		registrationNumber += numbers[randomIndex];
	}

	return registrationNumber;
}
