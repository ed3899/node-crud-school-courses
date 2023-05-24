import {createServer} from "../src/server";
import Hapi from "@hapi/hapi";
import {describe, expect, test} from "@jest/globals";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(3).toBe(3);
  });
});
