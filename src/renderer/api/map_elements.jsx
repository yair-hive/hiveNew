/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { map_name, project_name } = useParams();
  const hiveFetch = useHiveFetch();
  return useQuery(['elements', { map_name, project_name }], () => {
    const body = {
      category: 'map_elements',
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
    ({ element_name, from_row, from_col, to_row, to_col }) => {
      const body = {
        category: 'map_elements',
        action: 'create',
        map_name,
        project_name,
        element_name,
        from_row,
        from_col,
        to_row,
        to_col,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['elements', { map_name, project_name }]);
      },
    }
  );

  return mutation.mutateAsync;
}
function useDelete() {
  const { map_name, project_name } = useParams();
  const queryClient = useQueryClient();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    (elements_ids) => {
      const body = {
        category: 'map_elements',
        action: 'delete',
        elements_ids,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['elements', { map_name, project_name }]);
      },
    }
  );
  return mutation.mutate;
}

export default {
  useData,
  useCreate,
  useDelete,
};
