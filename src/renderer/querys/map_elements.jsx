import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useMapElementsData() {
    const { map_name, project_name } = useParams();
    return useQuery(
        ["elements", { map_name, project_name }],
        new_api.map_elements.get_all
    );
}
export function useMapElementsCreate() {
    const { map_name, project_name } = useParams();
    const hiveSocket = useSocket();
    const queryClient = useQueryClient();

    var mutation = useMutation(
        ({ data }) => {
            const { name, from_row, from_col, to_row, to_col } = data;
            return new_api.map_elements.create(
                map_name,
                project_name,
                name,
                from_row,
                from_col,
                to_row,
                to_col
            );
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    "elements",
                    { map_name, project_name },
                ]);
            },
        }
    );

    return mutation.mutate;
}
export function useMapElementsDelete() {
    const { map_name, project_name } = useParams();
    const hiveSocket = useSocket();
    const queryClient = useQueryClient();

    var mutation = useMutation(
        (elements_ids) => {
            elements_ids = JSON.stringify(elements_ids);
            return new_api.map_elements.delete(elements_ids);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    "elements",
                    { map_name, project_name },
                ]);
            },
        }
    );
    return mutation.mutate;
}
