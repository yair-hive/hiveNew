import hiveFetch from "./hiveFetch";

const map_elements = {}

map_elements['create'] = function(map_name, project_name, element_name, from_row, from_col, to_row, to_col){
    const body = {
        category: 'map_elements',
        action: 'create',
        map_name, project_name, element_name, from_row, from_col, to_row, to_col
    }
    return hiveFetch(body)
};
map_elements['get_all'] = function({queryKey}){
    const {map_name, project_name} = queryKey[1]
    const body = {
        category: 'map_elements',
        action: 'get_all',
        map_name, project_name
    }
    return hiveFetch(body)
};
map_elements['delete'] = function(elements_ids){
    const body = {
        category: 'map_elements',
        action: 'delete',
        elements_ids
    }
    return hiveFetch(body)
};

export default map_elements