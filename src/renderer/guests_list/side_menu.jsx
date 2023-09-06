/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
// import { useDownloadExcel } from 'react-export-table-to-excel';
import { useNavigate, useParams } from 'react-router-dom';
import api from 'renderer/api/api';
import {
  BelongsContext,
  GroupsContext,
  TagsContext,
  // TableRefContext,
} from '../app';
import AddGuest from '../components/add_guest';
import GroupsPop from '../components/groups_pop';
import ImportGuests from '../components/import_guests';
import HiveButton from '../hive_elements/hive_button';
import HiveSwitch from '../hive_elements/hive_switch';
import { useHive } from '../app_hooks';
import ExportPop from './export_pop';

function ProjectSideMenu() {
  const navigate = useNavigate();
  const { map_name, project_name } = useParams();

  const [mapState, setMap] = useState(null);
  const maps = api.maps.useDataAll();

  const mapsOptions = maps.data?.map((map) => map.map_name);

  useEffect(() => {
    if (mapState) navigate(`/maps/${project_name}/${mapState}`);
  }, [mapState]);

  return (
    <div className="sub_menu">
      <HiveSwitch
        options={mapsOptions}
        active={map_name}
        setActive={setMap}
        bordKey="KeyQ"
      />
    </div>
  );
}

function GuestsSideMenu() {
  const delete_all_guests = api.guests.useDeleteAll();
  const hive = useHive();
  // const { map_name } = useParams();

  // const [TableRefState] = useContext(TableRefContext);

  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: TableRefState,
  //   filename: map_name,
  //   sheet: '1',
  // });
  const [importPop, setImportPop] = useState(false);
  const [groupsPop, setGroupsPop] = useState(false);
  const setBelongsStatus = useContext(BelongsContext)[1];
  const setGroupsStatus = useContext(GroupsContext)[1];
  const setTagsStatus = useContext(TagsContext)[1];

  const groups = api.guestGroup.useData();
  const tags = api.tags.useData();

  let groupsOptions;
  let tagsOptions;

  if (groups.data) {
    const groups_array = Object.entries(groups.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    groupsOptions = groups_array.map(([key, group]) => {
      return group.name;
    });
    groupsOptions.push('הכל');
  }
  if (tags.data) {
    const tags_array = Object.entries(tags.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tagsOptions = tags_array.map(([key, tag]) => {
      return { name: tag.name, value: tag.id };
    });
    tagsOptions.push('הכל');
  }

  return (
    <div className="sub_menu">
      <ProjectSideMenu />
      <HiveButton onClick={() => hive.openPopUp('add_guest')}>
        הוסף בחורים
      </HiveButton>
      <AddGuest id="add_guest" />
      <HiveButton onClick={() => setImportPop(true)}>ייבא בחורים</HiveButton>
      <HiveButton onClick={delete_all_guests}>מחק את כל השמות</HiveButton>
      <ImportGuests status={importPop} setState={setImportPop} />
      <HiveButton onClick={() => setGroupsPop(true)}> קבוצות </HiveButton>
      <GroupsPop status={groupsPop} setState={setGroupsPop} />
      <HiveButton onClick={() => hive.openPopUp('guestExportPop')}>
        {' '}
        ייצא{' '}
      </HiveButton>
      <ExportPop />
      <HiveSwitch
        options={['משובצים', 'לא משובצים', 'הכל']}
        active="הכל"
        setActive={setBelongsStatus}
        bordKey="KeyQ"
      />
      <HiveSwitch
        multipleSelect
        options={groupsOptions}
        active="הכל"
        setActive={setGroupsStatus}
        bordKey="KeyX"
      />

      <HiveSwitch
        multipleSelect
        options={tagsOptions}
        active="הכל"
        setActive={setTagsStatus}
        bordKey="KeyB"
      />

      {/* <HiveButton onClick={onDownload}> ייצא </HiveButton> */}
    </div>
  );
}

export default GuestsSideMenu;
