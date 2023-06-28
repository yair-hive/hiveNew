import { useState } from "react";
import HiveButton from "../hive_elements/hive_button";
import PopUp from "../hive_elements/pop_up";
import { useMapsCreate } from "../querys/maps";
import { useNavigate, useParams } from "react-router-dom";
import { useHive } from "../app_hooks";

function AddMapPop({ id }) {
    const [name, setName] = useState("");
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);
    const create_map = useMapsCreate();

    const navigate = useNavigate();
    const hive = useHive();
    const { project_name } = useParams();

    async function onClick() {
        await create_map({ name, rows, cols });
        navigate(`/maps/${project_name}/${name}`);
        hive.closePopUp(id);
    }

    return (
        <PopUp title="הוסף מפה" id={id}>
            <form id="create_map_form">
                <label htmlFor="map_name"> שם המפה </label>
                <br />
                <input
                    type="text"
                    name="map_name"
                    onInput={(e) => setName(e.target.value)}
                />
                <br />
                <label htmlFor="rows_number"> מספר שורות </label>
                <br />
                <input
                    type="text"
                    name="rows_number"
                    onInput={(e) => setRows(e.target.value)}
                />
                <br />
                <label htmlFor="columns_number"> מספר טורים </label>
                <br />
                <input
                    type="text"
                    name="columns_number"
                    onInput={(e) => setCols(e.target.value)}
                />
                <br />
                <HiveButton onClick={onClick}> צור </HiveButton>
            </form>
        </PopUp>
    );
}

export default AddMapPop;
