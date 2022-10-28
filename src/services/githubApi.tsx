// import axios from 'axios';
import { Octokit } from 'octokit';
import { IData, IResponse } from './types';

const TOKEN = '';

const octokit = new Octokit({
  auth: TOKEN,
});

type TGetUsersData = (query: string, page: number) => Promise<IResponse>;

export const getUsersData: TGetUsersData = async (query, page) => {
  const { data }: IData = await octokit.request('GET /search/users', {
    q: query,
    // sort: 'repositories',
    // per_page: 15,
    page,
  });

  return data;
};
