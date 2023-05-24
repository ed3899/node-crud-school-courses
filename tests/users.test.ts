import {test, afterAll, beforeAll, describe, expect} from "@jest/globals";
import {createServer} from "../src/server";
import Hapi from "@hapi/hapi";

describe("POST /users - create user", () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  let userId: number;

  test("create user", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        firstName: "test-first-name",
        lastName: "test-last-name",
        email: `test-${Date.now()}@prisma.io`,
        social: {
          twitter: "thisisalice",
          website: "https://www.thisisalice.com",
        },
      },
    });

    expect(response.statusCode).toEqual(201);

    userId = JSON.parse(response.payload)?.id;

    expect(typeof userId == "number").toBeTruthy();
  });

  test("create user validation", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        lastName: "test-last-name",
        email: `test-${Date.now()}@prisma.io`,
        social: {
          twitter: "thisisalice",
          website: "https://www.thisisalice.com",
        },
      },
    });

    console.log(response.payload);
    expect(response.statusCode).toEqual(400);
  });

  test("get user return 404 for non existent user", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users/9999",
    });

    expect(response.statusCode).toEqual(404);
  });

  test("get user returns user", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/users/${userId}`,
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);

    expect(user.id).toBe(userId);
  });

  test("get user fails with invalid id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/users/a123",
    });
    expect(response.statusCode).toEqual(400);
  });
});
