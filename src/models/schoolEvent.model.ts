import {
	BelongsToMany,
	Column,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import School from "./school.model";
import Event from "./event.model";

// @Table
// class Book extends Model {
// 	@BelongsToMany(() => Author, () => BookAuthor)
// 	authors: Author[];
// }

// @Table
// class Author extends Model {
// 	@BelongsToMany(() => Book, () => BookAuthor)
// 	books: Book[];
// }

@Table
class SchoolEvent extends Model {
	@ForeignKey(() => School)
	@Column
	declare schoolId: string;

	@ForeignKey(() => Event)
	@Column
	declare eventId: string;
}

export default SchoolEvent;
