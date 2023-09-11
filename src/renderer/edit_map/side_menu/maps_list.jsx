import './maps_list.css';
import { useMapsAllData } from 'renderer/querys/maps';

function MapsList() {
  const maps = useMapsAllData();

  function renderMapsList() {
    if (maps.isLoading) return <div> טוען מפות </div>;
    if (maps.data) {
      return maps.data.map((map) => {
        return (
          <div
            key={map.id}
            style={{
              backgroundColor: 'rgb(65, 65, 65)',
              margin: 0,
              width: '100%',
            }}
          >
            {' '}
            {map.map_name}{' '}
          </div>
        );
      });
    }
    return 'error';
  }
  return <ul className="maps_list"> {renderMapsList()} </ul>;
}

export default MapsList;
