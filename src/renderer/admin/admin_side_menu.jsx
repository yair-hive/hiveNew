import { Link } from "react-router-dom"
import HiveButton from "../hive_elements/hive_button"

function AdminSideMenu(){
    return(
        <div className="side_menu">
            <HiveButton>
                <Link to={`users_list`}> משתמשים </Link>
            </HiveButton>
        </div>
    )
}

export default AdminSideMenu