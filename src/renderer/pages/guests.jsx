import GuestsTable from "../guests_list/guests_table";
import GuestsSideMenu from "../guests_list/side_menu";

function Guests() {
  return (
    <>
      <div className="main_bord guest_table">
        <GuestsTable />
      </div>
      <div className="side_menu">
        <GuestsSideMenu />
      </div>
    </>
  );
}

export default Guests;
