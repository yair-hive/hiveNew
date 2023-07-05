/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  return useQuery(['groups', { project_name }], () => {
    const body = {
      category: 'guest_groups',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useDelete() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();
  const mutation = useMutation(
    (group_id) => {
      const body = {
        category: 'guest_groups',
        action: 'delete',
        group_id,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
function useUpdate() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();

  const name_mutation = useMutation(
    ({ group_id, name }) => {
      const body = {
        category: 'guest_groups',
        action: 'update',
        fild: 'name',
        group_id,
        name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const color_mutation = useMutation(
    ({ group_id, color }) => {
      const body = {
        category: 'guest_groups',
        action: 'update',
        fild: 'color',
        group_id,
        color,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const score_mutation = useMutation(
    ({ group_id, score }) => {
      const body = {
        category: 'guest_groups',
        action: 'update',
        fild: 'score',
        group_id,
        score,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return {
    name: name_mutation.mutate,
    color: color_mutation.mutate,
    score: score_mutation.mutate,
  };
}

export default {
  useData,
  useDelete,
  useUpdate,
};
