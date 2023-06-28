import { useMutation, useQuery } from "react-query";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useProjectsData() {
    return useQuery(["projects"], new_api.projects.get);
}
export function useProjectsCreate() {
    const hiveSocket = useSocket();
    const mutation = useMutation(
        (name) => {
            return new_api.projects.create(name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["projects"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
