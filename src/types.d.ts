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
