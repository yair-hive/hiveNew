import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { FixedContext, MBloaderContext } from "../app";
import AddMapPop from "../components/add_map_pop";
import HiveButton from "../hive_elements/hive_button";
import { ShowScoreContext } from "./maps";
import { useHive, useSocket } from "../app_hooks";

function ProjectSM() {
    const { map_name, project_name } = useParams();

    const [MBstatus, setMBStatus] = useContext(MBloaderContext);
    const [showScore, setShowScore] = useContext(ShowScoreContext);

    const hiveSocket = useSocket();
    const queryClient = useQueryClient();
    const [fixedState, setfixedState] = useContext(FixedContext);
    const hive = useHive();

    function scheduling() {
        const source = new EventSource(
            `http://localhost:3025/actions/scheduling/${project_name}`
        );

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMBStatus(data.progress);
            if (data.progress == 100) {
                queryClient.invalidateQueries(["belongs", map_name]);
                var msg = JSON.stringify({
                    action: "invalidate",
                    quert_key: ["belongs", map_name],
                });
                hiveSocket.send(msg);
                source.close();
                setMBStatus(0);
            }
        };

        source.onerror = (error) => {
            console.error("An error occurred:", error);
        };
    }

    return (
        <div className="sub_menu">
            <Link to={`/guests/${project_name}`}>
                <HiveButton>שמות</HiveButton>
            </Link>
            <HiveButton onClick={scheduling}> שבץ </HiveButton>
            <HiveButton onClick={() => hive.openPopUp("add_map")}>
                {" "}
                הוסף מפה{" "}
            </HiveButton>
            <HiveButton onClick={() => setfixedState(!fixedState)}>
                {" "}
                ניהול מקומות קבועים{" "}
            </HiveButton>
            <HiveButton onClick={() => setShowScore(!showScore)}>
                {" "}
                הצג ניקוד{" "}
            </HiveButton>
            <AddMapPop id={"add_map"} />
        </div>
    );
}

export default ProjectSM;
