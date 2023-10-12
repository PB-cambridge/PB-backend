import { Optional } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import UserResult from "./result.model";

interface UserAttributes {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	address: string;
	schoolName: string;
	className: "Junior" | "Senior" | "Graduated";
	scienceOrArt: "Science" | "Art";
	hasPassport: boolean;
	course: string;
	results: UserResult[];
	registrationFee: number;
	whatsappNumber: string;
	registrationNumber: string;
	acknowledgementSent: boolean;
}

const user: UserAttributes = {} as UserAttributes;

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({ modelName: "User" })
class User extends Model<UserAttributes, UserCreationAttributes> {
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
		primaryKey: true,
	})
	declare id: typeof user.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare firstName: typeof user.firstName;

	@Column({ type: DataType.STRING, allowNull: false })
	declare lastName: typeof user.lastName;

	@Column({ type: DataType.STRING, allowNull: false })
	declare email: typeof user.email;

	@Column({ type: DataType.STRING, allowNull: false })
	declare phoneNumber: typeof user.phoneNumber;

	@Column({ type: DataType.STRING, allowNull: false })
	declare password: typeof user.password;

	@Column({ type: DataType.STRING, allowNull: false })
	declare address: typeof user.address;

	@Column({ type: DataType.STRING, allowNull: false })
	declare schoolName: typeof user.schoolName;

	@Column({
		type: DataType.ENUM("Junior", "Senior", "Graduated"),
		allowNull: false,
	})
	declare className: typeof user.className;

	@Column({ type: DataType.ENUM("Science", "Art"), allowNull: false })
	declare scienceOrArt: typeof user.scienceOrArt;

	@Column({ type: DataType.BOOLEAN, allowNull: false })
	declare hasPassport: typeof user.hasPassport;

	@Column({ type: DataType.STRING, allowNull: false })
	declare course: typeof user.course;

	@HasMany(() => UserResult)
	declare results: UserResult[];

	@Column({ type: DataType.DECIMAL, allowNull: false })
	declare registrationFee: typeof user.registrationFee;

	@Column({ type: DataType.STRING, allowNull: false })
	declare whatsappNumber: typeof user.whatsappNumber;

	@Column({ type: DataType.STRING, allowNull: false })
	declare registrationNumber: typeof user.registrationNumber;

	@Column({ type: DataType.BOOLEAN, allowNull: false })
	declare acknowledgementSent: typeof user.acknowledgementSent;
}

export default User;
