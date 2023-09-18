/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { SocketIdContext } from '../app';
import { useSocket } from '../app_hooks';
import useHiveFetch from './useHiveFetch';

function useData() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  return useQuery(['guests', { project_name }], () => {
    const body = {
      category: 'guests',
      action: 'get_all',
      project_name,
    };
    return hiveFetch(body);
  });
}
function useCreate() {
  const socketId = useContext(SocketIdContext);
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();

  const mutation = useMutation(
    ({ guestsData, importSeatNumber, importIdNumber }) => {
      const guestsDataString = JSON.stringify(guestsData);
      const body = {
        category: 'guests',
        action: 'create',
        guests: guestsDataString,
        importSeatNumber,
        importIdNumber,
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
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
        msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['groups', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutateAsync;
}
function useDelete() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ({ guest_id }) => {
      const body = {
        category: 'guests',
        action: 'delete',
        guest_id,
      };
      return hiveFetch(body);
    },
    {
      onMutate: (variables) => {
        queryClient.setQueryData(['guests', { project_name }], (old) => {
          old.forEach((guest, index) => {
            if (guest.id === variables.guest_id) {
              old.splice(index, 1);
            }
          });
          return old;
        });
      },
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return mutation.mutate;
}
function useDeleteAll() {
  const { project_name } = useParams();
  const hiveFetch = useHiveFetch();
  const hiveSocket = useSocket();

  const mutation = useMutation(
    () => {
      const body = {
        category: 'guests',
        action: 'delete_all',
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
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

  const activeMutation = useMutation(
    ({ guest_id, active }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'active',
        guest_id,
        active,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const lastMutation = useMutation(
    ({ guest_id, last_name }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'last',
        guest_id,
        last_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const firstMutation = useMutation(
    ({ guest_id, first_name }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'first',
        guest_id,
        first_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const groupMutation = useMutation(
    ({ guest_id, group_name }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'group',
        guest_id,
        group_name,
        project_name,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const scoreMutation = useMutation(
    ({ guest_id, score }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'score',
        guest_id,
        score,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const amountMutation = useMutation(
    ({ guest_id, amount }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'amount',
        guest_id,
        amount,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  const notesMutation = useMutation(
    ({ guest_id, notes }) => {
      const body = {
        category: 'guests',
        action: 'update',
        fild: 'notes',
        guest_id,
        notes,
      };
      return hiveFetch(body);
    },
    {
      onSuccess: () => {
        const msg = JSON.stringify({
          action: 'invalidate',
          query_key: ['guests', { project_name }],
        });
        hiveSocket.send(msg);
      },
    }
  );
  return {
    active: activeMutation.mutate,
    last: lastMutation.mutate,
    first: firstMutation.mutate,
    group: groupMutation.mutate,
    score: scoreMutation.mutate,
    amount: amountMutation.mutate,
    notes: notesMutation.mutate,
  };
}

export default {
  useData,
  useCreate,
  useDelete,
  useDeleteAll,
  useUpdate,
};
