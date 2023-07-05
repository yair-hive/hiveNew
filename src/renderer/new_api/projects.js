import hiveFetch from './hiveFetch';

const projects = {};

projects.create = (name) => {
  const body = {
    category: 'projects',
    action: 'create',
    name,
  };
  return hiveFetch(body);
};
projects.get = () => {
  const body = {
    category: 'projects',
    action: 'get',
  };
  return hiveFetch(body);
};

export default projects;
