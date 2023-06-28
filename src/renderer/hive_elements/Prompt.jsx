import "../style/prompt.css";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { useHive } from "../app_hooks";

function Prompt(props) {
    const Hive = useHive();
    const [InputValue, setInputValue] = useState(null);

    function onOk() {
        props.setValue(InputValue);
        Hive.closePopUp(props.id);
    }

    function onEnter(event) {
        if (event.code == "Enter") {
            onOk();
        }
    }

    useEffect(() => {
        document.addEventListener("keypress", onEnter);
        return () => document.removeEventListener("keypress", onEnter);
    });

    function closePopUp() {
        if (props.id) Hive.closePopUp(props.id);
        else props.setValue(false);
    }

    function onkeydown(event) {
        if (event.code == "Escape") Hive.closePopUp(props.id);
    }

    function onCancale() {
        Hive.closePopUp(props.id);
    }

    // useEffect(() => {
    //     document.addEventListener("keydown", onkeydown);
    //     return () => document.removeEventListener("keydown", onkeydown);
    // }, []);
    if (props.status || Hive.pop_ups[props.id])
        return ReactDOM.createPortal(
            <>
                <div className="blur" onClick={closePopUp}></div>
                <div className="prompt hive_but">
                    <div className="prompt_head hive_but">
                        <span className="title">{props.title}</span>
                    </div>
                    <div className="prompt_body hive_but">
                        <input
                            autoFocus
                            className="hive_but"
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={onEnter}
                        />
                        <div className="prompt_buttons hive_but">
                            <div
                                className="hive_but prompt_button ok_button"
                                onClick={onOk}
                            >
                                <span> אישור </span>
                            </div>
                            <div
                                className="hive_but prompt_button cancale_button"
                                onClick={onCancale}
                            >
                                <span> ביטול </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>,
            document.getElementById("pop_ups")
        );
    return null;
}

export default Prompt;
