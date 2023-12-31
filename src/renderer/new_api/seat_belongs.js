/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const seat_belongs = {};

seat_belongs.create = (project_name, seat_id, guest_id) => {
  const body = {
    category: 'seat_belongs',
    action: 'create',
    project_name,
    seat_id,
    guest_id,
  };
  return hiveFetch(body);
};
seat_belongs.check = (guest_id) => {
  const body = {
    category: 'seat_belongs',
    action: 'check',
    guest_id,
  };
  return hiveFetch(body);
};
seat_belongs.get_all = ({ queryKey }) => {
  const { project_name } = queryKey[1];
  const body = {
    category: 'seat_belongs',
    action: 'get_all',
    project_name,
  };
  return hiveFetch(body);
};
seat_belongs.delete_all = (project_name) => {
  const body = {
    category: 'seat_belongs',
    action: 'delete_all',
    project_name,
  };
  return hiveFetch(body);
};
seat_belongs.set_fixed = (id, value) => {
  const body = {
    category: 'seat_belongs',
    action: 'set_fixed',
    id,
    value,
  };
  return hiveFetch(body);
};

export default seat_belongs;
