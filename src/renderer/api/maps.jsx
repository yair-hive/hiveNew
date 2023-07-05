/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useDataAll() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['maps', { project_name }], () => {
    const body = {
      category: 'maps',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useData() {
  const { map_name, project_name } = useParams();
  const hiveFetch = useHiveFetch();

  return useQuery(['map', { map_name, project_name }], () => {
    const body = {
      category: 'maps',
      action: 'get',
      map_name,
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const { project_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const mutation = useMutation(
    ({ map_name, rows, cols }) => {
      const body = {
        category: 'maps',
        action: 'create',
        map_name,
        rows,
        cols,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['maps', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useUpdate() {
  const { project_name, map_name } = useParams();
  const hiveSocket = useSocket();
  const hiveFetch = useHiveFetch();

  const map_name_fild = useMutation(
    ({ new_name }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'map_name',
        map_name,
        project_name,
        new_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['maps', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const cols_to = useMutation(
    ({ to }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'cols_to',
        map_name,
        project_name,
        to,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['map', { map_name, project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const add_row = useMutation(
    ({ row }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'add_row',
        map_name,
        project_name,
        row,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['map', { map_name, project_name }],
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
  const add_col = useMutation(
    ({ col }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'add_col',
        map_name,
        project_name,
        col,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['map', { map_name, project_name }],
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
  const delete_row = useMutation(
    ({ row }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'delete_row',
        map_name,
        project_name,
        row,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['map', { map_name, project_name }],
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
  const delete_col = useMutation(
    ({ col }) => {
      const body = {
        category: 'maps',
        action: 'update',
        fild: 'delete_col',
        map_name,
        project_name,
        col,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        let msg;
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['map', { map_name, project_name }],
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
    cols_to: cols_to.mutate,
    add_row: add_row.mutate,
    add_col: add_col.mutate,
    delete_row: delete_row.mutate,
    delete_col: delete_col.mutate,
    map_name: map_name_fild.mutateAsync,
  };
}

export default {
  useDataAll,
  useData,
  useCreate,
  useUpdate,
};
