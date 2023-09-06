/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useContext } from 'react';
import { SocketIdContext } from 'renderer/app';
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
function useExport() {
  const hiveFetch = useHiveFetch();
  return useQuery(['projects_export'], () => {
    const body = {
      category: 'projects',
      action: 'export',
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    ({ name, password }) => {
      const body = {
        category: 'projects',
        action: 'create',
        name,
        password,
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
function useImport() {
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    ({ name, file }) => {
      const body = {
        category: 'projects',
        action: 'import',
        file,
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
  useExport,
  useImport,
};
