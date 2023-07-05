/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useSocket } from '../app_hooks';
import newApi from '../new_api/new_api';

function useLogin() {
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ user_name, password }) => {
      return newApi.users.login(user_name, password);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['user'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useCreate() {
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ user_name, password }) => {
      return newApi.users.create(user_name, password);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['user'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useLogout() {
  const hiveSocket = useSocket();

  const mutation = useMutation(
    () => {
      return newApi.users.logout();
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['user'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useData() {
  return useQuery(['user'], newApi.users.get_active);
}
function useDataAll() {
  return useQuery(['all_users'], newApi.users.get_all);
}

export default {
  useLogin,
  useCreate,
  useLogout,
  useData,
  useDataAll,
};
