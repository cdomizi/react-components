import { allUsers } from "mocks/data";
import { UserType } from "types";
import { getRandomData } from "utils/getRandomData";
import * as getRandomInt from "utils/getRandomInt";

const userId = 1;
const expectedUser = allUsers.find((user) => user.id === userId);

describe("getRandomData", () => {
  test("returns object with expected properties", async () => {
    vi.spyOn(getRandomInt, "getRandomInt").mockReturnValue(userId);

    const randomUser = await getRandomData<UserType>(
      "https://dummyjson.com/users",
    );

    expect(randomUser).toStrictEqual(expectedUser);
  });

  test("returns expected data if provided with second argument", async () => {
    const user = await getRandomData<UserType>(
      "https://dummyjson.com/users",
      userId,
    );

    expect(user).toStrictEqual(expectedUser);
  });
});
