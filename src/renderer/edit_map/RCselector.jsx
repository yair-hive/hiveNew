import { useContext } from "react";
import { EditContext } from "../app";
import "./row_col_selector.css";
import { SelectedRCcontext } from "./map";

function RCselector({ cell }) {
    const [edit, setEdit] = useContext(EditContext);
    const [selectedRC, setSelectedRC] = useContext(SelectedRCcontext);

    var number = cell.dir === "row" ? cell.row : cell.col;

    function onClick() {
        setSelectedRC({ number, dir: cell.dir });
    }

    if (edit === "ערוך") {
        var style;
        if (number === 0) style = { opacity: 0 };
        return (
            <div className="selector_cont" style={style}>
                <div className="row_col_selector hive_button" onClick={onClick}>
                    {number}
                </div>
            </div>
        );
    }
}

export default RCselector;
