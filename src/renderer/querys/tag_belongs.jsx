import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import new_api from '../new_api/new_api';

export function useTagBelongsData() {
  const { map_name, project_name } = useParams();
  return useQuery(
    ['tags_belongs', { map_name, project_name }],
    new_api.tag_belongs.get_all
  );
}
export function useTagBelongsCreate() {
  const { map_name, project_name } = useParams();
  const queryClient = useQueryClient();
  var mutation = useMutation(
    ({ seats, tag_name }) => {
      seats = JSON.stringify(seats);
      return new_api.tag_belongs.create(
        seats,
        tag_name,
        map_name,
        project_name
      );
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
  return mutation.mutateAsync;
}
