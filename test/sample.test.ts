import { expect } from "chai";
import request from "supertest";
import app from "../src/server";

describe("Api Test", () => {
	it("Try Welcome ", async () => {
		const res = await request(app).get("/");
		expect(res.status).equal(200);
		expect(res.body).haveOwnProperty("message");
	});
});
