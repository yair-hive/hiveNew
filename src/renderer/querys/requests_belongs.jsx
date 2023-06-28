import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useRequestsBelongsData() {
    const { project_name } = useParams();
    return useQuery(
        ["requests", { project_name }],
        new_api.requests_belongs.get_all
    );
}
export function useRequestsBelongsCreate() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();
    const mutation = useMutation(
        ({ guest_id, tag_id }) => {
            return new_api.requests_belongs.create(
                guest_id,
                tag_id,
                project_name
            );
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["requests", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useRequestsBelongsDelete() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();
    const mutation = useMutation(
        ({ request_id }) => {
            return new_api.requests_belongs.delete(request_id);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["requests", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
