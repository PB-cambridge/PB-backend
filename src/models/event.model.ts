import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";
import School from "./school.model";

interface EventAttributes {
	id: string;
	title: string;
	description: string;
	bannerImage: string;
	location: string;

	school: School;

	dateTime: Date;
	createdAt: Date;
	updatedAt: Date;
}

const event: EventAttributes = {} as EventAttributes;

interface EventCreationAttributes
	extends Optional<EventAttributes, "id" | "createdAt" | "updatedAt"> {}

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

	@Column({ type: DataType.STRING, allowNull: false })
	declare description: typeof event.description;

	@Column({ type: DataType.STRING, allowNull: false })
	declare bannerImage: typeof event.bannerImage;

	@Column({ type: DataType.STRING, allowNull: false })
	declare location: typeof event.location;

	@Column({ type: DataType.DATE, allowNull: false })
	declare dateTime: typeof event.dateTime;

	declare readonly createdAt: Date;
	declare readonly updatedAt: Date;
}

export default Event;
