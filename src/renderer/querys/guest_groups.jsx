import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useGuestGroupsData() {
    const { project_name } = useParams();
    return useQuery(["groups", { project_name }], new_api.guest_groups.get_all);
}
export function useGuestGroupsDelete() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();
    const mutation = useMutation(
        (group_id) => {
            return new_api.guest_groups.delete(group_id, project_name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["groups", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
export function useGuestGroupsUpdate() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();

    var name_mutation = useMutation(
        ({ group_id, name }) => {
            return new_api.guest_groups.update.name(group_id, name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["groups", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var color_mutation = useMutation(
        ({ group_id, color }) => {
            return new_api.guest_groups.update.color(group_id, color);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["groups", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var score_mutation = useMutation(
        ({ group_id, score }) => {
            return new_api.guest_groups.update.score(group_id, score);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["groups", { project_name }],
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
