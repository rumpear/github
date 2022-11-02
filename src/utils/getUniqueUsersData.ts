import { IFullUser } from '../services/types';

type TGetUniqueUsersData = <T extends IFullUser>(
  currData: T[],
  newData: T[]
) => T[];

export const getUniqueUsersData: TGetUniqueUsersData = <T extends IFullUser>(
  currData: T[],
  newData: T[]
) => {
  const usersLogins = currData.map((user: T) => user.login);
  const uniqueUsersData = newData.filter((currUser: T) => {
    return !usersLogins.includes(currUser.login);
  });

  return uniqueUsersData;
};
