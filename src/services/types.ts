import { IFullUser, IUsers } from '../interfaces';

export interface IResponse {
  total_count: number;
  incomplete_results: boolean;
  items: IUsers[];
}

export interface IUsersData {
  data: IResponse;
}

export type TGetUsersData = (query: string, page: number) => Promise<IResponse>;

export interface IFullUserData {
  data: IFullUser;
}

export type TGetFullUserData = (userName: string) => Promise<IFullUser>;
