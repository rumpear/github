// import axios from 'axios';
import { Octokit } from 'octokit';
import { IData, IResponse } from './types';

const TOKEN =
  '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';

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
  //   const { data }: IData = await octokit.request('GET /search/users', {
  //     q: query,
  //     // sort: 'repositories',
  //     // per_page: 15,
  //     page: 1,
  //   });

  return data;
};
