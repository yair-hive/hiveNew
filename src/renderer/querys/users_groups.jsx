import { useMutation, useQuery } from "react-query";
import new_api from "../new_api/new_api";
import { useSocket } from "../app_hooks";

export function useUserGroupsDataAll() {
    return useQuery(["all_user_groups"], new_api.user_groups.get_all);
}
export function useUserGroupsCreate() {
    const hiveSocket = useSocket();

    var mutation = useMutation(
        ({ name }) => {
            return new_api.user_groups.create(name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["all_user_groups"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useUserGroupsAddAction() {
    const hiveSocket = useSocket();

    var mutation = useMutation(
        ({ group_id, action_name }) => {
            return new_api.user_groups.add_action(group_id, action_name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["all_user_groups"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
