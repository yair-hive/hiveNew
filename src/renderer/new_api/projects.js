import hiveFetch from "./hiveFetch";

const projects = {}

projects['create'] = function(name){
    const body = {
        category: 'projects',
        action: 'create',
        name
    }
    return hiveFetch(body)
};
projects['get'] = function(){
    const body = {
        category: 'projects',
        action: 'get'
    }
    return hiveFetch(body)
};

export default projects