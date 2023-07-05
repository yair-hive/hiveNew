/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const guests = {};
guests.update = {};

guests.create = (guestsData, project_name, socketId) => {
  const body = {
    category: 'guests',
    action: 'create',
    guests: guestsData,
    project_name,
    socketId,
  };
  return hiveFetch(body);
};
guests.get_all = ({ queryKey }) => {
  const { project_name } = queryKey[1];
  const body = {
    category: 'guests',
    action: 'get_all',
    project_name,
  };
  return hiveFetch(body);
};
guests.delete = (guest_id) => {
  const body = {
    category: 'guests',
    action: 'delete',
    guest_id,
  };
  return hiveFetch(body);
};
guests.delete_all = (project_name) => {
  const body = {
    category: 'guests',
    action: 'delete_all',
    project_name,
  };
  return hiveFetch(body);
};
guests.update.first = (guest_id, first_name) => {
  const body = {
    category: 'guests',
    action: 'update',
    fild: 'first',
    guest_id,
    first_name,
  };
  return hiveFetch(body);
};
guests.update.last = (guest_id, last_name) => {
  const body = {
    category: 'guests',
    action: 'update',
    fild: 'last',
    guest_id,
    last_name,
  };
  return hiveFetch(body);
};
guests.update.group = (guest_id, group_name, project_name) => {
  const body = {
    category: 'guests',
    action: 'update',
    fild: 'group',
    guest_id,
    group_name,
    project_name,
  };
  return hiveFetch(body);
};
guests.update.score = (guest_id, score) => {
  const body = {
    category: 'guests',
    action: 'update',
    fild: 'score',
    guest_id,
    score,
  };
  return hiveFetch(body);
};

export default guests;
