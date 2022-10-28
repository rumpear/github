import { Octokit } from 'octokit';
import {
  IUsersData,
  IFullUserData,
  TGetFullUserData,
  TGetUsersData,
} from './types';

const TOKEN =
  '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';

export const PER_PAGE = 15;

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
