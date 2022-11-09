import { getFullUserData } from '../../services/githubApi';
import { IFullUser, IUsers } from '../../interfaces';

interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

type TGetAdditionalUsersData = (data: IUsers[]) => Promise<IFullUser[]>;

export const getAdditionalUsersData: TGetAdditionalUsersData = async (data) => {
  const logins = data.map((user) => {
    return user.login;
  });

  const promisedData = logins.map((login) => {
    return getFullUserData(login);
  });

  const settledData: PromiseSettledResult<IFullUser>[] =
    await Promise.allSettled(promisedData);

  const fulfilledData = settledData.filter((res) => {
    return res.status === 'fulfilled' && res.value;
  });

  const additionalUsersData = fulfilledData.map(
    (res) => (res as PromiseFulfilledResult<IFullUser>).value
  );

  return additionalUsersData;
};
