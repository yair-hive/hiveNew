import { useContext, useEffect, useRef, useState } from "react";
import { ActionsContext, EditContext } from "../app";
import "../style/elements.css";
import { useSelection } from "hive-select";

function GroupElement({ cell }) {
    const [edit, setEdit] = useContext(EditContext);
    const [action, setAction] = useContext(ActionsContext);
    const Pref = useRef(null);
    const [Cstyle, setCstyle] = useState({});
    const selection = useSelection();

    const [transformOrigin, setTransformOrigin] = useState(``);
    const [transform, setTransform] = useState(``);
    const [initPointerPos, setInitPointerPos] = useState({ x: 0, y: 0 });
    const [PrectState, setPrect] = useState();
    const [size, setSize] = useState();
    const [right, setRight] = useState(0);
    const [top, setTop] = useState(0);

    function MouseMoveXRight(event) {
        if (initPointerPos.x != 0) {
            var new_size = { ...size };
            new_size.width =
                PrectState.width + event.clientX - initPointerPos.x;
            setSize(new_size);
        }
    }
    function MouseMoveXLeft(event) {
        if (initPointerPos.x != 0) {
            var new_size = { ...size };
            new_size.width =
                PrectState.width - (event.clientX - initPointerPos.x);
            setSize(new_size);
        }
    }
    function MouseMoveYTop(event) {
        if (initPointerPos.y != 0) {
            var new_size = { ...size };
            new_size.height =
                PrectState.height - (event.clientY - initPointerPos.y);
            setSize(new_size);
        }
    }
    function MouseMoveYBottom(event) {
        if (initPointerPos.y != 0) {
            var new_size = { ...size };
            new_size.height =
                PrectState.height + (event.clientY - initPointerPos.y);
            setSize(new_size);
        }
    }
    function MouseUp(event) {
        document.removeEventListener("mousemove", MouseMoveXRight);
        document.removeEventListener("mousemove", MouseMoveXLeft);
        document.removeEventListener("mousemove", MouseMoveYTop);
        document.removeEventListener("mousemove", MouseMoveYBottom);
        document.removeEventListener("mouseup", MouseUp);
        selection?.enable();
    }

    useEffect(() => {
        if (action === "groups" && edit == "ערוך") {
            var Prect = Pref.current.getBoundingClientRect();
            setPrect(Prect);
            if (Prect.height > Prect.width)
                setCstyle({ transform: "rotate(90deg)" });
        }
    }, [action]);

    useEffect(() => {
        setSize({ height: PrectState?.height, width: PrectState?.width - 6 });
    }, [PrectState]);

    cell.from_row = Number(cell.from_row);
    cell.from_col = Number(cell.from_col);
    cell.to_row = Number(cell.to_row);
    cell.to_col = Number(cell.to_col);

    var { from_row, from_col, to_row, to_col } = cell;

    to_row++;
    to_col++;

    if (edit == "ערוך") {
        from_row++;
        from_col++;
        to_row++;
        to_col++;
    }

    useEffect(() => console.log(right), [right]);

    function onMouseOver(event) {
        setInitPointerPos({ x: event.clientX, y: event.clientY });
    }

    function onClickScaleXLeft(event) {
        setRight("0");
        document.addEventListener("mousemove", MouseMoveXLeft);
        document.addEventListener("mouseup", MouseUp);
        selection?.disable();
    }

    function onClickScaleXRight(event) {
        setRight("100");
        document.addEventListener("mousemove", MouseMoveXRight);
        document.addEventListener("mouseup", MouseUp);
        selection?.disable();
    }
    function onClickScaleYTop(event) {
        setTop("0");
        document.addEventListener("mousemove", MouseMoveYTop);
        document.addEventListener("mouseup", MouseUp);
        selection?.disable();
    }

    function onClickScaleYBottom(event) {
        setTop("100");
        document.addEventListener("mousemove", MouseMoveYBottom);
        document.addEventListener("mouseup", MouseUp);
        selection?.disable();
    }

    if (action === "groups" && edit == "ערוך") {
        return (
            <>
                <div
                    className={`group-element-cont`}
                    ref={Pref}
                    style={{
                        gridRowStart: from_row,
                        gridColumnStart: from_col,
                        gridRowEnd: to_row,
                        gridColumnEnd: to_col,
                    }}
                >
                    <div
                        className={`group-element`}
                        group_id={cell.id}
                        style={{
                            height: `${size?.height}px`,
                            width: `${size?.width}px `,
                            "--right-value": right,
                            "--top-value": top,
                            "--group-element-height": `${size?.height}px`,
                            "--group-element-width": `${size?.width}px`,
                        }}
                    >
                        <div
                            className="resizer left"
                            onMouseOver={onMouseOver}
                            onMouseDown={onClickScaleXLeft}
                        />
                        <div
                            className="resizer right"
                            onMouseOver={onMouseOver}
                            onMouseDown={onClickScaleXRight}
                        />
                        <div
                            className="resizer top"
                            onMouseOver={onMouseOver}
                            onMouseDown={onClickScaleYTop}
                        />
                        <div
                            className="resizer bottom"
                            onMouseOver={onMouseOver}
                            onMouseDown={onClickScaleYBottom}
                        />
                        <div style={Cstyle}>{cell.name}</div>
                    </div>
                </div>
            </>
        );
    }
}

export default GroupElement;
