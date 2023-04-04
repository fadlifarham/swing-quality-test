import { createLogger, transports, format, LoggerOptions } from "winston";
import morgan from "morgan";

const winstontLoggerOption: LoggerOptions = {
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
		format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		new transports.File({
			filename: "./logs/all-logs.log",
			maxsize: 5242880,
			maxFiles: 5,
		}),
		new transports.Console(),
	],
};

export const logger = createLogger(winstontLoggerOption);

/**
 * export morgan
 * TODO need to config with winston
 */
export default morgan("combined");
