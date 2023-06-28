import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useTagsData() {
    const { project_name } = useParams();
    return useQuery(["tags", { project_name }], new_api.tags.get_all);
}
export function useTagsDelete() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();

    var mutation = useMutation(
        ({ tag_id }) => {
            return new_api.tags.delete(tag_id);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["tags", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
export function useTagsUpdate() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();

    var name_mutation = useMutation(
        ({ tag_id, name }) => {
            return new_api.tags.update.name(tag_id, name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["tags", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var color_mutation = useMutation(
        ({ tag_id, color }) => {
            return new_api.tags.update.color(tag_id, color);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["tags", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var score_mutation = useMutation(
        ({ tag_id, score }) => {
            return new_api.tags.update.score(tag_id, score);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["tags", { project_name }],
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
