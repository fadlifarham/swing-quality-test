import "reflect-metadata";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import App from "./app";
import dotEnv from "dotenv";
import modelInit from "./models";
import controllers from "./controllers";

dotEnv.config();

const middleWares = [
  bodyParser.json({
    limit: "5mb"
  }),
  bodyParser.urlencoded({ extended: true }),
  cors(),
  // middleware baru
];

if (process.env.NODE_ENV !== "test") {
  middleWares.push(morgan("combined"));
}

const { app } = new App({
	controllers: controllers,
	middleWares: middleWares,
	actions: [modelInit]
});

const PORT = +(process.env.PORT || 4000);

app.listen(PORT, "0.0.0.0", async () => {
	await modelInit();
	console.log(`[LISTEN] 🚀🚀🚀  starting http://localhost:${PORT}/api/v1`);
});

/**
 * default export for testing
 */
export default app;
