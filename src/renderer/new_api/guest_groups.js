/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const guest_groups = {};
guest_groups.update = {};

guest_groups.get_all = ({ queryKey }) => {
  const { project_name } = queryKey[1];
  const body = {
    category: 'guest_groups',
    action: 'get_all',
    project_name,
  };
  return hiveFetch(body);
};
guest_groups.delete = (group_id, project_name) => {
  const body = {
    category: 'guest_groups',
    action: 'delete',
    group_id,
    project_name,
  };
  return hiveFetch(body);
};
guest_groups.update.name = (group_id, name) => {
  const body = {
    category: 'guest_groups',
    action: 'update',
    fild: 'name',
    group_id,
    name,
  };
  return hiveFetch(body);
};
guest_groups.update.color = (group_id, color) => {
  const body = {
    category: 'guest_groups',
    action: 'update',
    fild: 'color',
    group_id,
    color,
  };
  return hiveFetch(body);
};
guest_groups.update.score = (group_id, score) => {
  const body = {
    category: 'guest_groups',
    action: 'update',
    fild: 'score',
    group_id,
    score,
  };
  return hiveFetch(body);
};

export default guest_groups;
