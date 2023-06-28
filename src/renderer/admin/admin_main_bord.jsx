import { Route, Routes } from "react-router-dom"
import UsersList from "../user_components/users_list"

function AdminMainBord(){
    return(
        <div className="main_bord">
            <Routes>
                <Route path="users_list" element={<UsersList />}/>
            </Routes>
        </div>
    )
}

export default AdminMainBord