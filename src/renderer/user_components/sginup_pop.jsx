import { useState } from "react";
import PopUp from "../hive_elements/pop_up";
import HiveButton from "../hive_elements/hive_button";
import { useUserCreate } from "../querys/users";
import { useHive } from "../app_hooks";

function SginupPop({ id }) {
    const user_create = useUserCreate();
    const Hive = useHive();

    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const style = {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    };

    function onUserNameChange(e) {
        setUserName(e.target.value);
    }
    function onPasswordChange(e) {
        setPassword(e.target.value);
    }
    async function onLoginClick() {
        await user_create({ user_name, password });
        Hive.closePopUp(id);
    }

    return (
        <PopUp id={id} title="הרשם">
            <div style={style}>
                <label> שם משתמש </label>
                <input onChange={onUserNameChange} />
                <label> סיסמה </label>
                <input onChange={onPasswordChange} />
                <HiveButton onClick={onLoginClick}> הרשם </HiveButton>
            </div>
        </PopUp>
    );
}

export default SginupPop;
