/* eslint-disable react/prop-types */
import { useState } from "react";
import HiveButton from "../hive_elements/hive_button";
import PopUp from "../hive_elements/pop_up";
import { useProjectsCreate } from "../querys/projects";
import { useNavigate } from "react-router-dom";
import { useHive } from "../app_hooks";

function AddProjectPop({ id }) {
    const [name, setName] = useState("");
    const create_project = useProjectsCreate();
    const navigate = useNavigate();
    const hive = useHive();

    async function onClick() {
        await create_project(name);
        navigate(`/maps/${name}`);
        hive.closePopUp(id);
    }

    return (
        <PopUp id={id} title="הוסף פרוייקט">
            <form id="create_map_form">
                <label> שם הפרוייקט </label>
                <br />
                <input type="text" onInput={(e) => setName(e.target.value)} />
                <br />
                <HiveButton onClick={onClick}> צור </HiveButton>
            </form>
        </PopUp>
    );
}

export default AddProjectPop;
