import { IResult } from '../scenes/IResult';

const ADD_RESULT_URL = 'http://localhost:5000/api/score/add';
const GET_RESULTS_URL = ' http://localhost:5000/api/score/all ';

export const getAllResults = async (): Promise<[IResult]> => {
  const response = await fetch(GET_RESULTS_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  return data;
};

export const addResult = (result: string): void => {
  fetch(ADD_RESULT_URL, {
    method: 'POST',
    body: result,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
