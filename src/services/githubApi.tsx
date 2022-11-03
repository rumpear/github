import { Octokit } from 'octokit';
import { PER_PAGE, TOKEN } from '../constants';
import {
  IUsersData,
  IFullUserData,
  TGetFullUserData,
  TGetUsersData,
} from './types';

const octokit = new Octokit({
  auth: TOKEN,
});

export const getUsersData: TGetUsersData = async (query, page) => {
  const { data }: IUsersData = await octokit.request('GET /search/users', {
    q: query,
    // sort: 'repositories',
    per_page: PER_PAGE,
    page,
  });

  return data;
};

export const getFullUserData: TGetFullUserData = async (userName) => {
  const { data }: IFullUserData = await octokit.request(
    `GET /users/${userName}`
  );

  return data;
};
