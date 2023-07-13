/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { project_name, map_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['seats_groups', { project_name, map_name }], () => {
    const body = {
      category: 'seats_groups',
      action: 'get_all',
      map_name,
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const { project_name, map_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    async ({ group_name, from_row, from_col, to_row, to_col }) => {
      const body = {
        category: 'seats_groups',
        action: 'create',
        group_name,
        from_row,
        from_col,
        to_row,
        to_col,
        map_name,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          quert_key: ['seats_groups', { project_name }],
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
    async (groups_ids) => {
      const groupsIdsString = JSON.stringify(groups_ids);
      const body = {
        category: 'seats_groups',
        action: 'delete',
        groups_ids: groupsIdsString,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          quert_key: ['seats_groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useUpdate() {
  const { project_name, map_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();

  const fromRow = useMutation(
    ({ group_id, value }) => {
      const body = {
        category: 'seats_groups',
        action: 'update',
        fild: 'from_row',
        group_id,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats_groups', { project_name, map_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const fromCol = useMutation(
    ({ group_id, value }) => {
      const body = {
        category: 'seats_groups',
        action: 'update',
        fild: 'from_col',
        group_id,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats_groups', { project_name, map_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const toRow = useMutation(
    ({ group_id, value }) => {
      const body = {
        category: 'seats_groups',
        action: 'update',
        fild: 'to_row',
        group_id,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats_groups', { project_name, map_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const toCol = useMutation(
    ({ group_id, value }) => {
      const body = {
        category: 'seats_groups',
        action: 'update',
        fild: 'to_col',
        group_id,
        value,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats_groups', { project_name, map_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['seats', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );

  return {
    to_row: toRow.mutateAsync,
    to_col: toCol.mutateAsync,
    from_row: fromRow.mutateAsync,
    from_col: fromCol.mutateAsync,
  };
}

export default {
  useData,
  useCreate,
  useDelete,
  useUpdate,
};
