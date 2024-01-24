import { allUsers } from "mocks/data";
import { UserType } from "types";
import * as getRandomData from "utils/getRandomData";
import * as getRandomInt from "utils/getRandomInt";

describe("getRandomInt", () => {
  test("return random integer between 1 and 10 with no arguments", () => {
    expect(getRandomInt.getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt.getRandomInt()).toBeLessThanOrEqual(10);
  });

  test("return random integer between 1 and provided argument", () => {
    expect(getRandomInt.getRandomInt()).toBeGreaterThanOrEqual(1);
    expect(getRandomInt.getRandomInt(8)).toBeLessThanOrEqual(8);
  });

  test("return random integer in the provided range", () => {
    expect(getRandomInt.getRandomInt(12, 5)).toBeGreaterThanOrEqual(5);
    expect(getRandomInt.getRandomInt(12, 5)).toBeLessThanOrEqual(12);
  });
});

describe("getRandomData", () => {
  const expectedRandomUser = allUsers[0];

  test("returns object with expected properties", async () => {
    vi.spyOn(getRandomInt, "getRandomInt").mockReturnValue(1);

    const randomUser = await getRandomData.getRandomData<UserType>(
      "https://dummyjson.com/users",
    );

    expect(randomUser).toStrictEqual(expectedRandomUser);
  });

  test("returns expected data if provided with second argument", async () => {
    const user = await getRandomData.getRandomData<UserType>(
      "https://dummyjson.com/users",
      expectedRandomUser.id,
    );

    expect(user).toStrictEqual(expectedRandomUser);
  });
});
