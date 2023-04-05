import * as Jimp from "jimp";
import { asyncHandler, ErrorResponse } from "../utils";
import { NextFunction, Request, Response } from "express";
// import * as Exif from "exif";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Exif = require("exif").ExifImage;
import * as fs from "fs";

export const compressImage = (directory: string) => {
	return asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const filename: string = req.file.filename;
			const mime: Array<string> = filename.split(".");

			if (mime[1].toLowerCase() === "jpg" || mime[1].toLowerCase() === "jpeg" || mime[1].toLowerCase() === "png") {
				const img = await Jimp.read(directory + filename);
				await img.quality(50);
				const exifImage = new Exif(
					{ image: directory + filename },
					async (error: Error, exifData: any) => {
						if (error) {
							await img.write(directory + filename);
							if (await fs.existsSync(directory + filename)) {
								next();
							} else {
								if (await fs.existsSync(directory + filename)) {
									next();
								} else {
									return next(
										new ErrorResponse(
											"Upload was failed. Please try again",
											400
										)
									);
								}
							}
						} else {
							if (exifData.image.Orientation) {
								const orientation = exifData.image.Orientation;
								if (orientation == 2) {
									// Mirror horizontal
									await img.flip(true, false);
									// await img.rotate(180)
								} else if (orientation == 3) {
									// Rotate 180
									await img.rotate(-180);
								} else if (orientation == 4) {
									// Mirror vertical
									await img.flip(false, true);
								} else if (orientation == 5) {
									// Mirror horizontal and rotate 270 CW
									await img.flip(true, false);
									await img.rotate(270);
								} else if (orientation == 6) {
									// Rotate 90 CW
									await img.rotate(90);
									// await img.rotate(180);
									// await img.flip(true, true);
								} else if (orientation == 7) {
									// Mirror horizontal and rotate 90 CW
									await img.rotate(90);
									await img.flip(true, false);
								} else if (orientation == 8) {
									// Rotate 270 CW
									await img.rotate(270);
								}
								await img.write(directory + filename);
								if (await fs.existsSync(directory + filename)) {
									next();
								} else {
									if (await fs.existsSync(directory + filename)) {
										next();
									} else {
										return next(
											new ErrorResponse(
												"Upload was failed. Please try again",
												400
											)
										);
									}
								}
							} else {
								await img.write(directory + filename);
								if (await fs.existsSync(directory + filename)) {
									next();
								} else {
									if (await fs.existsSync(directory + filename)) {
										next();
									} else {
										return next(
											new ErrorResponse(
												"Upload was failed. Please try again",
												400
											)
										);
									}
								}
							}
						}
					}
				);
			}

			req.file.filename = filename;

			next();
		}
	);
};
