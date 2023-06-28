import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "../app_hooks";
import new_api from "../new_api/new_api";

export function useMapsAllData() {
    const { project_name } = useParams();
    return useQuery(["maps", { project_name }], new_api.maps.get_all);
}
export function useMapsData() {
    const { map_name, project_name } = useParams();
    return useQuery(["map", { map_name, project_name }], new_api.maps.get);
}
export function useMapsCreate() {
    const { project_name } = useParams();
    const hiveSocket = useSocket();
    const mutation = useMutation(
        ({ name, rows, cols }) => {
            return new_api.maps.create(name, rows, cols, project_name);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["maps", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return mutation.mutateAsync;
}
export function useMapsUpdate() {
    const { project_name, map_name } = useParams();
    const hiveSocket = useSocket();

    var map_name_fild = useMutation(
        ({ new_name }) => {
            return new_api.maps.update.map_name(
                map_name,
                project_name,
                new_name
            );
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["maps", { project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var cols_to = useMutation(
        ({ to }) => {
            return new_api.maps.update.cols_to(map_name, project_name, to);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["map", { map_name, project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var add_row = useMutation(
        ({ row }) => {
            return new_api.maps.update.add_row(map_name, project_name, row);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["map", { map_name, project_name }],
                });
                hiveSocket.send(msg);
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["seats", { map_name, project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var add_col = useMutation(
        ({ col }) => {
            return new_api.maps.update.add_col(map_name, project_name, col);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["map", { map_name, project_name }],
                });
                hiveSocket.send(msg);
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["seats", { map_name, project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var delete_row = useMutation(
        ({ row }) => {
            return new_api.maps.update.delete_row(map_name, project_name, row);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["map", { map_name, project_name }],
                });
                hiveSocket.send(msg);
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["seats", { map_name, project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    var delete_col = useMutation(
        ({ col }) => {
            return new_api.maps.update.delete_col(map_name, project_name, col);
        },
        {
            onSuccess: () => {
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["map", { map_name, project_name }],
                });
                hiveSocket.send(msg);
                var msg = JSON.stringify({
                    action: "invalidate",
                    query_key: ["seats", { map_name, project_name }],
                });
                hiveSocket.send(msg);
            },
        }
    );
    return {
        cols_to: cols_to.mutate,
        add_row: add_row.mutate,
        add_col: add_col.mutate,
        delete_row: delete_row.mutate,
        delete_col: delete_col.mutate,
        map_name: map_name_fild.mutateAsync,
    };
}
