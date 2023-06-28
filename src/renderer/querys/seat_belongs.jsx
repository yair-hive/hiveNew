import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useSeatBelongsData() {
    const { project_name } = useParams();
    return useQuery(
        ["belongs", { project_name }],
        new_api.seat_belongs.get_all
    );
}
export function useSeatBelongsCreate() {
    const { map_name, project_name } = useParams();
    const hiveSocket = useSocket();
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async ({ guest_id, seat_id }) => {
            return new_api.seat_belongs.create(project_name, seat_id, guest_id);
        },
        {
            onSuccess: (data, variables) => {
                var { guest_id, seat_id } = variables;
                queryClient.setQueryData(
                    ["belongs", { project_name }],
                    (old) => {
                        old.forEach((item, index) => {
                            if (item.guest == guest_id) old.splice(index, 1);
                            if (item.seat == seat_id) item.guest = guest_id;
                        });
                        return old;
                    }
                );
                var msg = JSON.stringify({
                    action: "invalidate",
                    quert_key: ["belongs", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
export function useSeatBelongsDelete() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();

    const mutation = useMutation(
        async () => {
            return new_api.seat_belongs.delete_all(project_name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    quert_key: ["belongs", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
export function useSeatBelongsSetFixed() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();

    const mutation = useMutation(
        async ({ id, value }) => {
            return new_api.seat_belongs.set_fixed(id, value);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    quert_key: ["belongs", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
