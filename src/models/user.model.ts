import { Optional } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";

interface PersonAttributes {
	_id: string;
	name: string;
	age: number;
	mas?: number;
	size: boolean;
}

interface PersonCreationAttributes extends Optional<PersonAttributes, "_id"> {}

@Table({})
class User extends Model<PersonAttributes, PersonCreationAttributes> {
	@Column({ defaultValue: DataType.UUIDV4 })
	declare _id: string;

	@Column({})
	declare name: string;

	@Column({})
	declare age: number;

	@Column({})
	declare mas: number;

	@Column({})
	declare size: boolean;

	// @Column()
	// declare isOnline: boolean;
}

export default User;
