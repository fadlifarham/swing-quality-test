import { writeFileSync, appendFileSync } from "fs";
import moment from "moment";

const fileNameGenerator = (nameArgs: string) => {
	return `${moment().format("YYYYMMDDHHmmssSS")}-${nameArgs}.ts`;
};

/**
 *
 * function to generate file
 *
 * @param fileDestination path dir destionation
 * @param nameArgs name file to generate
 * @param content content to insert
 */
export const generateFile = (
	fileDestination: string,
	nameArgs: string,
	content: string[]
): void => {
	/**
	 * write the file
	 * TODO replace with async for better experience
	 * TODO handle path with path resolve
	 */
	const filesGenerated = fileNameGenerator(nameArgs);
	writeFileSync(`${fileDestination + filesGenerated}`, content.join("\n"));

	console.log(
		`file ${filesGenerated} successfully generated at ${fileDestination}`
	);
};

/**
 *
 * Function to generate file,
 * without generate timestamp name
 *
 * @param fileDestination path dir destionation
 * @param nameArgs name file to generate
 * @param content content to insert
 */
export const generateFileWithoutTs = (
	fileDestination: string,
	nameArgs: string,
	content: string[]
): void => {
	/**
	 * write the file
	 * TODO replace with async for better experience
	 * TODO handle path with path resolve
	 */
	writeFileSync(`${fileDestination + nameArgs}`, content.join("\n"));

	console.log(`file ${nameArgs} successfully generated at ${fileDestination}`);
};

/**
 *
 * FUnction to add a line on a file
 *
 * @param fileTarget path target file
 * @param content content to write
 */
export const appendToaFile = (fileTarget: string, content: string): void => {
	appendFileSync(fileTarget, content);

	console.log(`file ${fileTarget} succeefully append`);
};
