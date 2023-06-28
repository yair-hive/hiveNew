import "./dropDown.css";

function DropDown({ open, children }) {
    var className = `drop-down ${open ? "open" : ""}`;
    return <div className={className}>{children}</div>;
}

export default DropDown;
