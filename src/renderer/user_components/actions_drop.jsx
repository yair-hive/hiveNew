import { useHive } from "../app_hooks";
import HiveButton from "../hive_elements/hive_button";

function ActionsDrop({ drop, setDrop, ...props }) {
    const Hive = useHive();

    var class_name = `actions_drop ${drop ? "active" : ""}`;

    return (
        <div className={class_name} {...props}>
            <HiveButton
                onClick={() => {
                    Hive.openPopUp("login");
                    setDrop(false);
                }}
            >
                {" "}
                התחבר{" "}
            </HiveButton>
            <HiveButton> התנתק </HiveButton>
            <HiveButton
                onClick={() => {
                    Hive.openPopUp("sginup");
                    setDrop(false);
                }}
            >
                {" "}
                הרשם{" "}
            </HiveButton>
        </div>
    );
}

export default ActionsDrop;
