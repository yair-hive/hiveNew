/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from 'renderer/api/api';
import HiveButton from 'renderer/hive_elements/hive_button';
import PopUp from 'renderer/hive_elements/pop_up';

function GroupFild({ groupName, groupId, setCheck }) {
  function onChange() {
    setCheck((check) => {
      const newCheck = [...check];
      const idIndex = check.indexOf(groupId);
      if (idIndex !== -1) {
        newCheck.splice(idIndex, 1);
      } else {
        newCheck.push(groupId);
      }
      return newCheck;
    });
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <input type="checkbox" onChange={onChange} />
      {groupName}
    </div>
  );
}
function downloadStringAsFile(data, exportName, fileExtension) {
  const dataStr = `data:text/csv;charset=utf-8,${encodeURIComponent(
    `\ufeff ${data}`
  )}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.${fileExtension}`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
function convertToCsv(data) {
  const header = Object.keys(data[0]).join(',');
  const values = data.map((o) => Object.values(o).join(',')).join('\n');
  return `${header}\n${values}`;
}
function ExportPop() {
  const [showGroupsSelect, setShowGroupsSelect] = useState(true);
  const guestGroups = api.guestGroup.useData();
  const seats = api.seats.useDataAll();
  const belongs = api.seatBelongs.useData();
  const guests = api.guests.useData();
  const groups = api.guestGroup.useData();
  const requests = api.requestsBelongs.useData();
  const tagsBelongs = api.tagBelongs.useData();

  const [check, setCheck] = useState([]);
  const [belongSelect, setBelong] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { project_name } = useParams();

  const createData = useCallback(() => {
    const rows = [];
    if (
      guests.data &&
      belongs.data &&
      groups.data &&
      seats.data &&
      tagsBelongs.data &&
      requests.data
    ) {
      const belongs_object = {};
      const seats_object = {};
      const requests_object = {};
      requests.data.forEach((request) => {
        requests_object[request.guest] = [];
      });
      requests.data.forEach((request) =>
        requests_object[request.guest].push(request)
      );
      belongs.data.forEach((belong) => {
        belongs_object[belong.guest] = belong;
      });
      seats.data.forEach((seat) => {
        seats_object[seat.id] = seat;
      });
      for (const guest of guests.data) {
        let seat_id = false;
        const group = groups.data[guest.guest_group];
        if (belongs_object[guest.id]) seat_id = belongs_object[guest.id].seat;
        const seat = seats_object[seat_id];
        const tags = tagsBelongs.data[seat_id] ? tagsBelongs.data[seat_id] : [];
        const group_score = group ? group.score : 0;
        rows.push({
          guest_id: guest.id,
          last_name: guest.last_name,
          first_name: guest.first_name,
          group_name: group?.name,
          seat_number: seat?.seat_number,
          tags,
          score: Number(group_score) + Number(guest.score),
          requests: requests_object[guest.id],
          seat: seat_id,
          group: group.id,
        });
      }
    }
    return rows;
  }, [
    belongs.data,
    groups.data,
    guests.data,
    requests.data,
    seats.data,
    tagsBelongs.data,
  ]);

  const filterData = useCallback(
    (data) => {
      const filter1 = data.filter((row) => {
        if (belongSelect === 'belongsOnly') {
          return row.seat;
        }
        return !row.seat;
      });
      return filter1.filter((row) => {
        return check.indexOf(row.group) !== -1;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [belongSelect, createData, check]
  );
  function prosessData(data) {
    return data.map((row) => {
      return {
        last_name: row.last_name,
        first_name: row.first_name,
        group_name: row.group_name,
        seat_number: row.seat_number,
      };
    });
  }
  function renderGroups() {
    if (guestGroups.data) {
      const groupsArray = Object.entries(guestGroups.data).map(
        ([, value]) => value
      );
      return groupsArray.map((group) => {
        return (
          <GroupFild
            groupName={group.name}
            groupId={group.id}
            setCheck={setCheck}
            key={group.id}
          />
        );
      });
    }
    return 'טוען';
  }
  let groupsAllIds;
  if (guestGroups.data) {
    const groupsArray = Object.entries(guestGroups.data).map(
      ([, value]) => value
    );
    groupsAllIds = groupsArray.map((group) => {
      return group.id;
    });
  }
  return (
    <PopUp id="guestExportPop">
      <form dir="rtl">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <label> משובצים בלבד </label>
          <input
            type="radio"
            name="belogs"
            onChange={() => {
              setBelong('belongsOnly');
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <label> לא משובצים בלבד </label>
          <input
            type="radio"
            name="belogs"
            onChange={() => {
              setBelong('notBelonsOnly');
            }}
          />
        </div>
        <br />
        <label> שיעורים </label>
        <HiveButton
          onClick={() => {
            if (groupsAllIds) {
              if (showGroupsSelect) {
                setCheck(groupsAllIds);
                setShowGroupsSelect(false);
              } else {
                setCheck([]);
                setShowGroupsSelect(true);
              }
            }
          }}
          active={!showGroupsSelect}
        >
          {' '}
          בחר הכל{' '}
        </HiveButton>
        {showGroupsSelect ? renderGroups() : ''}
        <HiveButton
          onClick={() => {
            downloadStringAsFile(
              convertToCsv(prosessData(filterData(createData()))),
              `${project_name}`,
              'csv'
            );
          }}
        >
          {' '}
          ייצא{' '}
        </HiveButton>
      </form>
    </PopUp>
  );
}

export default ExportPop;
