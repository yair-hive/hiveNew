import { useMutation, useQuery } from 'react-query';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const hiveFetch = useHiveFetch();
  return useQuery(['projects'], () => {
    const body = {
      category: 'projects',
      action: 'get',
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    (name) => {
      const body = {
        category: 'projects',
        action: 'create',
        name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['projects'],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}

export default {
  useData,
  useCreate,
};
