import { IFullUser } from '../../interfaces';

type TToggleIsFavProp = (
  prev: IFullUser[],
  currUserLogin: string
) => IFullUser[];

export const toggleIsFavProp: TToggleIsFavProp = (prev, currUserLogin) => {
  return prev.map((user) => {
    if (user.login === currUserLogin) {
      return { ...user, isFavorite: !user.isFavorite };
    }
    return user;
  });
};
