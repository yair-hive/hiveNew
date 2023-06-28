import { useMutation, useQuery } from "react-query";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useUserLogin() {
    const hiveSocket = useSocket();

    var mutation = useMutation(
        ({ user_name, password }) => {
            return new_api.users.login(user_name, password);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["user"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useUserCreate() {
    const hiveSocket = useSocket();

    var mutation = useMutation(
        ({ user_name, password }) => {
            return new_api.users.create(user_name, password);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["user"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useUserLogout() {
    const hiveSocket = useSocket();

    var mutation = useMutation(
        () => {
            return new_api.users.logout();
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["user"],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useUserData() {
    return useQuery(["user"], new_api.users.get_active);
}
export function useUserDataAll() {
    return useQuery(["all_users"], new_api.users.get_all);
}
