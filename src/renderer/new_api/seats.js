/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const seats = {};
seats.update = {};

seats.create = (map_name, project_name, data) => {
  const body = {
    category: 'seats',
    action: 'create',
    map_name,
    project_name,
    data,
  };
  return hiveFetch(body);
};
seats.get = ({ queryKey }) => {
  const { map_name, project_name } = queryKey[1];
  const body = {
    category: 'seats',
    action: 'get',
    map_name,
    project_name,
  };
  return hiveFetch(body);
};
seats.get_score = async ({ queryKey }) => {
  const { map_name, project_name } = queryKey[1];
  const url = `http://localhost/actions/score/${project_name}/${map_name}`;
  const res = await fetch(url);
  return await res.json();
};
seats.get_all = ({ queryKey }) => {
  const { project_name } = queryKey[1];
  const body = {
    category: 'seats',
    action: 'get_all',
    project_name,
  };
  return hiveFetch(body);
};
seats.delete = (seats_ids) => {
  const body = {
    category: 'seats',
    action: 'delete',
    seats_ids,
  };
  return hiveFetch(body);
};
seats.update.numbers = (seats_numbers) => {
  const body = {
    category: 'seats',
    action: 'update',
    fild: 'numbers',
    seats_numbers,
  };
  return hiveFetch(body);
};

export default seats;
