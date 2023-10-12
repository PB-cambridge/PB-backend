import { Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import UserResult from "./result.model";
import School from "./school.model";

interface UserAttributes {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	phoneNumber: string;

	school: School;
	schoolId: string;

	level: "Junior" | "Senior" | "Graduated";
	scienceOrArt: "Science" | "Art";
	passport: string;

	results: UserResult[];
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
	declare address: typeof user.address;

	@Column({ type: DataType.STRING, allowNull: false })
	declare phoneNumber: typeof user.phoneNumber;

	@ForeignKey(() => School)
	@Column
	declare shoolId: string;

	@BelongsTo(() => School)
	declare school: School;

	@Column({
		type: DataType.ENUM("Junior", "Senior", "Graduated"),
		allowNull: false,
	})
	declare level: typeof user.level;

	@Column({ type: DataType.ENUM("Science", "Art"), allowNull: false })
	declare scienceOrArt: typeof user.scienceOrArt;

	@Column({ type: DataType.STRING, allowNull: false })
	declare passport: typeof user.passport;

	@HasMany(() => UserResult)
	declare results: UserResult[];

	@Column({ type: DataType.STRING, allowNull: false })
	declare whatsappNumber: typeof user.whatsappNumber;

	@Column({ type: DataType.STRING, allowNull: false })
	declare registrationNumber: typeof user.registrationNumber;

	@Column({ type: DataType.BOOLEAN, allowNull: false })
	declare acknowledgementSent: typeof user.acknowledgementSent;
}

export default User;
