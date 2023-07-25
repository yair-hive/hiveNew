import '../style/side_menu.css';
import React, { useState } from 'react';
import SideMenu from '../edit_map/side_menu';
import Map from '../edit_map/map';

export const ShowScoreContext = React.createContext(null);

function Maps() {
  const [showScore, setShowScore] = useState(false);

  return (
    <ShowScoreContext.Provider value={[showScore, setShowScore]}>
      <Map />
      <SideMenu />
    </ShowScoreContext.Provider>
  );
}

export default Maps;
