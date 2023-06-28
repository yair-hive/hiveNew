import hiveFetch from "./hiveFetch";

const users = {}

users['login'] = function(user_name, password){
    const body = {
        category: 'users',
        action: 'login',
        user_name, password
    }
    return hiveFetch(body)
}
users['logout'] = function(){
    const body = {
        category: 'users',
        action: 'logout',
    }
    return hiveFetch(body)
}
users['create'] = function(user_name, password){
    const body = {
        category: 'users',
        action: 'create',
        user_name, password
    }
    return hiveFetch(body)
}
users['get_active'] = function(){
    const body = {
        category: 'users',
        action: 'get_active',
    }
    return hiveFetch(body)
}
users['get_all'] = function(){
    const body = {
        category: 'users',
        action: 'get_all',
    }
    return hiveFetch(body)
}

export default users