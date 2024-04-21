import { expect, test, describe } from "vitest";
function sum(a: number, b: number) {
  return a + b;
}

// Use the `test` function to run a test
/*
test("test something", () => {
  const endNodes = ["GSERV02301", "FSERV00101"];
  console.log(ReturnClosestNode("FHALL02901", endNodes, "astar"));
});

 */

// Use the `describe` function to group related tests
describe("sum", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("adds 2 + 2 to equal 4", () => {
    expect(sum(2, 2)).toBe(4);
  });
});
