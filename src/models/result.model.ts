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

interface UserResultAttributes {
	id: number;
	studentId: string;
	student: User;
	resultData: string;
}

const userResult: UserResultAttributes = {} as UserResultAttributes;

interface UserResultCreationAttributes
	extends Optional<UserResultAttributes, "id"> {}

@Table({ modelName: "UserResult" })
class UserResult extends Model<
	UserResultAttributes,
	UserResultCreationAttributes
> {
	@Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
	declare id: typeof userResult.id;

	@ForeignKey(() => User)
	@Column({ type: DataType.UUID })
	declare studentId: typeof userResult.studentId;

	@BelongsTo(() => User)
	declare student: User;

	@Column({ type: DataType.STRING, allowNull: false })
	declare resultData: typeof userResult.resultData;
}

export default UserResult;
