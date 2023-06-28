import hiveFetch from "./hiveFetch";

const seats_groups = {}

seats_groups['create'] = function(group_name, from_row, from_col, to_row, to_col, map_name, project_name){
    const body = {
        category: 'seats_groups',
        action: 'create',
        group_name, from_row, from_col, to_row, to_col, map_name, project_name
    }
    return hiveFetch(body)
};
seats_groups['get_all'] = function({queryKey}){
    const {map_name, project_name} = queryKey[1]
    const body = {
        category: 'seats_groups',
        action: 'get_all',
        map_name, project_name
    }
    return hiveFetch(body)
};
seats_groups['delete'] = function(){
    const body = {
        category: 'seats_groups',
        action: 'delete'
    }
    return hiveFetch(body)
};
seats_groups['update'] = function(){
    const body = {
        category: 'seats_groups',
        action: 'update'
    }
    return hiveFetch(body)
};

export default seats_groups