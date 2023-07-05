/* eslint-disable camelcase */
import hiveFetch from './hiveFetch';

const tags = {};
tags.update = {};

tags.get_all = ({ queryKey }) => {
  const { project_name } = queryKey[1];
  const body = {
    category: 'tags',
    action: 'get_all',
    project_name,
  };
  return hiveFetch(body);
};
tags.delete = (tag_id) => {
  const body = {
    category: 'tags',
    action: 'delete',
    fild: '',
    tag_id,
  };
  return hiveFetch(body);
};
tags.update.name = (tag_id, name) => {
  const body = {
    category: 'tags',
    action: 'update',
    fild: 'name',
    tag_id,
    name,
  };
  return hiveFetch(body);
};
tags.update.color = (tag_id, color) => {
  const body = {
    category: 'tags',
    action: 'update',
    fild: 'color',
    tag_id,
    color,
  };
  return hiveFetch(body);
};
tags.update.score = (tag_id, score) => {
  const body = {
    category: 'tags',
    action: 'update',
    fild: 'score',
    tag_id,
    score,
  };
  return hiveFetch(body);
};

export default tags;
