/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const tag_belongs = {};

tag_belongs.create = (seats, tag_name, map_name, project_name) => {
  const body = {
    category: 'tag_belongs',
    action: 'create',
    seats,
    tag_name,
    map_name,
    project_name,
  };
  return hiveFetch(body);
};
tag_belongs.get_all = ({ queryKey }) => {
  const { map_name, project_name } = queryKey[1];
  const body = {
    category: 'tag_belongs',
    action: 'get_all',
    map_name,
    project_name,
  };
  return hiveFetch(body);
};

export default tag_belongs;
