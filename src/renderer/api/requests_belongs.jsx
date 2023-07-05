/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const hiveFetch = useHiveFetch();
  const { project_name } = useParams();

  return useQuery(['requests', { project_name }], () => {
    const body = {
      category: 'requests_belongs',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const hiveFetch = useHiveFetch();
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const mutation = useMutation(
    ({ guest_id, tag_id }) => {
      const body = {
        category: 'requests_belongs',
        action: 'create',
        guest_id,
        tag_id,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['requests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useDelete() {
  const hiveFetch = useHiveFetch();
  const { project_name } = useParams();
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ request_id }) => {
      const body = {
        category: 'requests_belongs',
        action: 'delete',
        request_id,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['requests', { project_name }],
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
};
