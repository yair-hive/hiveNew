import { useContext } from "react";
import { EditContext, SelectablesContext } from "../app";
import "./cell.css";
import { SelectedRCcontext } from "./map";

function PlaseHolder({ cell }) {
    const [edit, setEdit] = useContext(EditContext);
    const selecteblsState = useContext(SelectablesContext);
    const [selectedRC, setSelectedRC] = useContext(SelectedRCcontext);

    if (selecteblsState) {
        if (selecteblsState[0] === "cells" && edit == "ערוך") {
            var selected_class =
                (selectedRC.dir === "row" &&
                    selectedRC.number === Number(cell.row)) ||
                (selectedRC.dir === "col" &&
                    selectedRC.number === Number(cell.col))
                    ? " selected"
                    : "";
            var selectable_class = " selectable";
        } else {
            var selectable_class = "";
            var selected_class = "";
        }
    }

    return (
        <div
            className={`cell${selectable_class}${selected_class}`}
            cell-row={cell.row}
            cell-col={cell.col}
        />
    );
}

export default PlaseHolder;
