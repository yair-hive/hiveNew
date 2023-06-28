import hiveFetch from "./hiveFetch";

const requests_belongs = {}

requests_belongs['create'] = function(guest_id, tag_id, project_name){
    const body = {
        category: 'requests_belongs',
        action: 'create',
        guest_id, tag_id, project_name
    }
    return hiveFetch(body)
};
requests_belongs['delete'] = function(request_id){
    const body = {
        category: 'requests_belongs',
        action: 'delete',
        request_id
    }
    return hiveFetch(body)
};
requests_belongs['get_all'] = function({queryKey}){
    const {project_name} = queryKey[1]
    const body = {
        category: 'requests_belongs',
        action: 'get_all',
        project_name
    }
    return hiveFetch(body)
};

export default requests_belongs