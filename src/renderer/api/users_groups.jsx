/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import newApi from '../new_api/new_api';
import { useSocket } from '../app_hooks';

function useDataAll() {
  return useQuery(['all_user_groups'], newApi.user_groups.get_all);
}
function useCreate() {
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ name }) => {
      return newApi.user_groups.create(name);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['all_user_groups'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useAddAction() {
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ group_id, action_name }) => {
      return newApi.user_groups.add_action(group_id, action_name);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['all_user_groups'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}

export default {
  useDataAll,
  useCreate,
  useAddAction,
};
