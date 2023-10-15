import { Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import User from "./user.model";
import School from "./school.model";

interface UserResultAttributes {
	id: string;

	studentName: string;
	// student?: User;

	school?: School;
	schoolId: string;

	reading: number;
	writing: number;
	mathematics: number;
	total: number;
	position: number;
	year: string;
}

const userResult: UserResultAttributes = {} as UserResultAttributes;

interface UserResultCreationAttributes
	extends Optional<UserResultAttributes, "id"> {}

@Table({ modelName: "UserResult" })
class UserResult extends Model<
	UserResultAttributes,
	UserResultCreationAttributes
> {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
	})
	declare id: typeof userResult.id;

	// @ForeignKey(() => User)
	@Column({ type: DataType.STRING, allowNull: false })
	declare studentName: typeof userResult.studentName;

	// @BelongsTo(() => User)
	// declare student: User;

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

export default UserResult;
