export class ErrorResponse extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
	}
}

export interface SuccessMessage {
  msg: string
}

export const isSuccessMsg = (arg: any): arg is SuccessMessage => {
  return arg && arg.msg && typeof (arg.msg) == "string";
};

