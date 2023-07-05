/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const seats_groups = {};

seats_groups.create = (
  group_name,
  from_row,
  from_col,
  to_row,
  to_col,
  map_name,
  project_name
) => {
  const body = {
    category: 'seats_groups',
    action: 'create',
    group_name,
    from_row,
    from_col,
    to_row,
    to_col,
    map_name,
    project_name,
  };
  return hiveFetch(body);
};
seats_groups.get_all = ({ queryKey }) => {
  const { map_name, project_name } = queryKey[1];
  const body = {
    category: 'seats_groups',
    action: 'get_all',
    map_name,
    project_name,
  };
  return hiveFetch(body);
};
seats_groups.delete = () => {
  const body = {
    category: 'seats_groups',
    action: 'delete',
  };
  return hiveFetch(body);
};
seats_groups.update = () => {
  const body = {
    category: 'seats_groups',
    action: 'update',
  };
  return hiveFetch(body);
};

export default seats_groups;
