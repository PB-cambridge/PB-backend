import { Optional } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface AnnouncementAttributes {
	id: number;
	content: string;
	date: Date;
}

const announcement: AnnouncementAttributes = {} as AnnouncementAttributes;

interface AnnouncementCreationAttributes
	extends Optional<AnnouncementAttributes, "id"> {}

@Table({ modelName: "Announcement" })
class Announcement extends Model<
	AnnouncementAttributes,
	AnnouncementCreationAttributes
> {
	@Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
	declare id: typeof announcement.id;

	@Column({ type: DataType.STRING, allowNull: false })
	declare content: typeof announcement.content;

	@Column({ type: DataType.DATE, allowNull: false })
	declare date: typeof announcement.date;
}

// export default Announcement;
