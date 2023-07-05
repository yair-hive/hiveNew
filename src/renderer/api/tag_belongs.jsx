/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { map_name, project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['tags_belongs', { map_name, project_name }], () => {
    const body = {
      category: 'tag_belongs',
      action: 'get_all',
      map_name,
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const { map_name, project_name } = useParams();
  const queryClient = useQueryClient();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    ({ seats, tag_name }) => {
      const seatsString = JSON.stringify(seats);
      const body = {
        category: 'tag_belongs',
        action: 'create',
        seats: seatsString,
        tag_name,
        map_name,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tags', { project_name }]);
        queryClient.invalidateQueries([
          'tags_belongs',
          { map_name, project_name },
        ]);
      },
    }
  );
  return mutation.mutate;
}

export default {
  useData,
  useCreate,
};
