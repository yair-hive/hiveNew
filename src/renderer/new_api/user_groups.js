/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const user_groups = {};

user_groups.get_all = async () => {
  const body = {
    category: 'user_groups',
    action: 'get_all',
  };
  return hiveFetch(body);
};
user_groups.get_group_actions = async (group_id) => {
  const body = {
    category: 'user_groups',
    action: 'get_group_actions',
    group_id,
  };
  return hiveFetch(body);
};
user_groups.create = (name) => {
  const body = {
    category: 'user_groups',
    action: 'create',
    name,
  };
  return hiveFetch(body);
};
user_groups.add_action = (group_id, action_name) => {
  const body = {
    category: 'user_groups',
    action: 'add_action',
    group_id,
    action_name,
  };
  return hiveFetch(body);
};

export default user_groups;
