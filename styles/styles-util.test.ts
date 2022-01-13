import { cssToTuples } from "./styles-util";

describe("cssToTuples", () => {
  it("should convert to tuples correctly", () => {
    const string = "box-sizing: test;";
    expect(cssToTuples(string)).toEqual([["box-sizing", "test"]]);
  });

  it("should convert 2 rules to tuples correctly", () => {
    const string = "box-sizing: border-box; margin-top: 1px";
    expect(cssToTuples(string)).toEqual([
      ["box-sizing", "border-box"],
      ["margin-top", "1px"],
    ]);
  });
});
