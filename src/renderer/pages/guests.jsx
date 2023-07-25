/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-cycle */
import { useEffect, useState } from 'react';
import GuestsTable from '../guests_list/guests_table';
import GuestsSideMenu from '../guests_list/side_menu';

function Guests() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const contentElement = document.getElementById('content');
    if (!open) contentElement.style.gridTemplateColumns = '99% 1%';
    else contentElement.style.gridTemplateColumns = '78% 22%';
  }, [open]);

  return (
    <>
      <div className="main_bord guest_table">
        <GuestsTable />
      </div>
      <div
        className="side_menu"
        style={{ zIndex: 200, padding: open ? '' : '0' }}
      >
        <div
          onClick={() => setOpen(!open)}
          style={{
            position: 'absolute',
            backgroundColor: 'gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            width: '15px',
            height: '15px',
            cursor: 'pointer',
            right: open ? '22%' : '1%',
            zIndex: 450,
            fontSize: '15px',
          }}
        >
          {open ? <span>&#10005;</span> : <span>&#60;</span>}
        </div>
        {open ? <GuestsSideMenu /> : ''}
      </div>
    </>
  );
}

export default Guests;
