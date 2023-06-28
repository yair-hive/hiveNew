import hiveFetch from "./hiveFetch";

const maps = {}
maps.update = {}

maps['create'] = function(map_name, rows, cols, project_name){
    const body = {
        category: 'maps',
        action: 'create',
        map_name, rows, cols, project_name
    }
    return hiveFetch(body)
};
maps['get_all'] = function({queryKey}){
    const {project_name} = queryKey[1]
    const body = {
        category: 'maps',
        action: 'get_all',
        project_name
    }
    return hiveFetch(body)
};
maps['get'] = function({queryKey}){
    const {map_name, project_name} = queryKey[1]
    const body = {
        category: 'maps',
        action: 'get',
        map_name, project_name
    }
    return hiveFetch(body)
};
maps['update']['map_name'] = function(map_name, project_name, new_name){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'map_name',
        map_name, project_name, new_name
    }
    return hiveFetch(body)
};
maps['update']['cols_to'] = function(map_name, project_name, to){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'cols_to',
        map_name, project_name, to
    }
    return hiveFetch(body)
};
maps['update']['add_row'] = function(map_name, project_name, row){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'add_row',
        map_name, project_name, row
    }
    return hiveFetch(body)
};
maps['update']['add_col'] = function(map_name, project_name, col){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'add_col',
        map_name, project_name, col
    }
    return hiveFetch(body)
};
maps['update']['delete_row'] = function(map_name, project_name, row){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'delete_row',
        map_name, project_name, row
    }
    return hiveFetch(body)
};
maps['update']['delete_col'] = function(map_name, project_name, col){
    const body = {
        category: 'maps',
        action: 'update',
        fild: 'delete_col',
        map_name, project_name, col
    }
    return hiveFetch(body)
};

export default maps