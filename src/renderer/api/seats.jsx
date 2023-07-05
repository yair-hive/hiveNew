/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { map_name, project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['seats', { map_name, project_name }], () => {
    const body = {
      category: 'seats',
      action: 'get',
      map_name,
      project_name,
    };
    return hiveFetch(body);
  });
}
function useDataAll() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['seats_all', { project_name }], () => {
    const body = {
      category: 'seats',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const { map_name, project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    (seats) => {
      const seatsString = JSON.stringify(seats);
      const body = {
        category: 'seats',
        action: 'create',
        map_name,
        project_name,
        data: seatsString,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useDelete() {
  const { map_name, project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    (seats_ids) => {
      const seatsIdsString = JSON.stringify(seats_ids);
      const body = {
        category: 'seats',
        action: 'delete',
        seats_ids: seatsIdsString,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );

  return mutation.mutate;
}
function useUpdate() {
  const { map_name, project_name } = useParams();
  const queryClient = useQueryClient();
  const hiveFetch = useHiveFetch();

  const nambers_mutation = useMutation(
    ({ data }) => {
      const dataString = JSON.stringify(data);
      const body = {
        category: 'seats',
        action: 'update',
        fild: 'numbers',
        seats_numbers: dataString,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['seats', { map_name, project_name }]);
      },
    }
  );

  return {
    numbers: nambers_mutation.mutateAsync,
  };
}

export default {
  useData,
  useDataAll,
  useCreate,
  useDelete,
  useUpdate,
};
