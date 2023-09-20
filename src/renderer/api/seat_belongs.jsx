/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  return useQuery(['belongs', { project_name }], () => {
    const body = {
      category: 'seat_belongs',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const queryClient = useQueryClient();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    async ({ guest_id, seat_id }) => {
      const body = {
        category: 'seat_belongs',
        action: 'create',
        project_name,
        seat_id,
        guest_id,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: (data, variables) => {
        const { guest_id, seat_id } = variables;
        queryClient.setQueryData(['belongs', { project_name }], (old) => {
          old.forEach((item, index) => {
            if (item.guest === guest_id) old.splice(index, 1);
            if (item.seat === seat_id) item.guest = guest_id;
          });
          return old;
        });
        const msg = JSON.stringify({
          action: 'invalidate',
          quert_key: ['belongs', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useDelete() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    async () => {
      const body = {
        category: 'seat_belongs',
        action: 'delete_all',
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          quert_key: ['belongs', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
function useSetFixed() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    async ({ id, value }) => {
      const body = {
        category: 'seat_belongs',
        action: 'set_fixed',
        id,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['belongs', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
function useSetFixedAll() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    async ({ belongIds, value }) => {
      const body = {
        category: 'seat_belongs',
        action: 'set_fixed_all',
        belongIds,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['belongs', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}

export default {
  useData,
  useCreate,
  useDelete,
  useSetFixed,
  useSetFixedAll,
};
