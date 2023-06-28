import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useSeatsGroupsData() {
    const { project_name, map_name } = useParams();
    return useQuery(
        ["seats_groups", { project_name, map_name }],
        new_api.seats_groups.get_all
    );
}
export function useSeatsGroupsCreate() {
    const { project_name, map_name } = useParams();
    const hiveSocket = useSocket();

    const mutation = useMutation(
        async ({ data }) => {
            const { name, from_row, from_col, to_row, to_col } = data;
            return new_api.seats_groups.create(
                name,
                from_row,
                from_col,
                to_row,
                to_col,
                map_name,
                project_name
            );
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    quert_key: ["seats_groups", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutate;
}
export function useSeatsGroupsDelete() {}
export function useSeatsGroupsUpdate() {}
