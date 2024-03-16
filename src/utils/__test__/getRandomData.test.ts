import { allUsers } from "mocks/data";
import { UserType } from "types";
import { getRandomData } from "utils/getRandomData";
import * as getRandomInt from "utils/getRandomInt";

describe("getRandomData", () => {
  const expectedRandomUser = allUsers[0];

  test("returns object with expected properties", async () => {
    vi.spyOn(getRandomInt, "getRandomInt").mockReturnValue(1);

    const randomUser = await getRandomData<UserType>(
      "https://dummyjson.com/users",
    );

    expect(randomUser).toStrictEqual(expectedRandomUser);
  });

  test("returns expected data if provided with second argument", async () => {
    const user = await getRandomData<UserType>(
      "https://dummyjson.com/users",
      expectedRandomUser.id,
    );

    expect(user).toStrictEqual(expectedRandomUser);
  });
});
