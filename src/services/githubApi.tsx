import { Octokit } from 'octokit';
import { PER_PAGE, TOKEN } from '../constants';
import { getAdditionalUsersData } from '../utils';
import {
  IUsersData,
  IFullUserData,
  TGetFullUserData,
  TGetUsersData,
} from './types';

const octokit = new Octokit({
  auth: TOKEN,
});

export const getUsersData: TGetUsersData = async (query, page = 1) => {
  const { data }: IUsersData = await octokit.request('GET /search/users', {
    q: query,
    per_page: PER_PAGE,
    page,
  });

  const additionalData = await getAdditionalUsersData(data.items);
  return { data: additionalData, totalCount: data.total_count };
};

export const getFullUserData: TGetFullUserData = async (userName) => {
  const { data }: IFullUserData = await octokit.request(
    `GET /users/${userName}`
  );

  return data;
};
