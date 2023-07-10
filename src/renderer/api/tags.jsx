/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['tags', { project_name }], () => {
    const body = {
      category: 'tags',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useDelete() {
  const { project_name, map_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    ({ tag_id }) => {
      const body = {
        category: 'tags',
        action: 'delete',
        fild: '',
        tag_id,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['tags_belongs', { map_name, project_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['tags', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
function useUpdate() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const name_mutation = useMutation(
    ({ tag_id, name }) => {
      const body = {
        category: 'tags',
        action: 'update',
        fild: 'name',
        tag_id,
        name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['tags', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const color_mutation = useMutation(
    ({ tag_id, color }) => {
      const body = {
        category: 'tags',
        action: 'update',
        fild: 'color',
        tag_id,
        color,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['tags', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const score_mutation = useMutation(
    ({ tag_id, score }) => {
      const body = {
        category: 'tags',
        action: 'update',
        fild: 'score',
        tag_id,
        score,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['tags', { project_name }],
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
