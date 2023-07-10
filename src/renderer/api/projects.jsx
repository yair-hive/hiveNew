/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useContext } from 'react';
import { SocketIdContext } from 'renderer/App';
import { useParams } from 'react-router-dom';
import useHiveFetch from './useHiveFetch';
import { useSocket } from '../app_hooks';

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
function useScheduling() {
  const socketId = useContext(SocketIdContext);
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();

  const mutation = useMutation(
    () => {
      const body = {
        category: 'projectActions',
        action: 'scheduling',
        project_name,
        socketId,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg = '';
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['belongs', { project_name }],
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
  useScheduling,
};
