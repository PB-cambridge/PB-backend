type IResponse = {
	ok: boolean;
};

export type ErrorResponse<T> = IResponse & {
	error: {
		message: string;
		details?: T;
	};
};

export type SuccessResponse<T> = IResponse & {
	message?: string;
	data?: T;
};

type TAcknowledgementTemp = {
	id?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	address?: string;
	phoneNumber?: string;
	schoolId?: string;
	level?: string;
	scienceOrArt?: string;
	hasInternationalPassport?: boolean;
	passport?: string;
	whatsappNumber?: string;
	regNo?: string;
	acknowledgementSent?: boolean;
	competitionId?: string;
	createdAt?: string;
	updatedAt?: string;
	school: {
		id?: string;
		name?: string;
	};
	competition: {
		id?: string;
		endDate?: Date;
		startDate?: Date;
		name?: string;
	};
	competionFee?: number;
	paidAmount?: number;
	reference?: string;
};
