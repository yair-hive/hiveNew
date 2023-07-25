/* eslint-disable react/prop-types */
import './dropDown.css';

function DropDown({ open, children }) {
  const className = `drop-down ${open ? 'open' : ''}`;
  return <div className={className}>{children}</div>;
}

export default DropDown;
