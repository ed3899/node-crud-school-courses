import {createServer} from "../src/server";
import Hapi from "@hapi/hapi";
import {describe, expect, test, beforeAll, afterAll} from "@jest/globals";

describe("Status plugin", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("status endpoint return 200", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/",
    });
    expect(res.statusCode).toEqual(200);
    const response = JSON.parse(res.payload);
    expect(response.up).toEqual(true);
  });
});
