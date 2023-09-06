/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
/* eslint-disable no-return-await */
import { v4 as uuidv4 } from 'uuid';
import {
  db_post,
  db_get,
  check_parameters,
  get_project_id,
  get_map_id,
} from './functions.js';

const projects = {};

projects.create = async function (request_body) {
  check_parameters(['name', 'password'], request_body);
  const password = request_body.password;

  if (password === '2233') {
    const name = request_body.name;
    const query_string = `INSERT INTO projects (id, name) VALUES (UUID(), '${name}')`;
    await db_post(query_string);
  }
};
projects.get = async function () {
  var query_string = 'SELECT * FROM projects';
  return await db_get(query_string);
};
projects.export = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);

  const mapsQuery = `SELECT * FROM maps WHERE project = '${project_id}'`;
  const guestsQuery = `SELECT * FROM guests WHERE project = '${project_id}'`;
  const guestsGroupsQuery = `SELECT * FROM guests_groups WHERE project = '${project_id}'`;
  const guestsRequestsQuery = `SELECT * FROM guests_requests WHERE project = '${project_id}'`;
  const tagsQuery = `SELECT * FROM tags WHERE project = '${project_id}'`;
  const seatsQuery = `SELECT * FROM seats WHERE project = '${project_id}'`;
  const seatsBelongsQuery = `SELECT * FROM belong WHERE project = '${project_id}'`;

  const maps = await db_get(mapsQuery);
  const guests = await db_get(guestsQuery);
  const guestsGroups = await db_get(guestsGroupsQuery);
  const guestsRequests = await db_get(guestsRequestsQuery);
  const tags = await db_get(tagsQuery);
  const seats = await db_get(seatsQuery);
  const seatsBelongs = await db_get(seatsBelongsQuery);

  const mapElements = [];
  const seatsGroups = [];
  const tagBelongs = [];

  for (const map of maps) {
    const { map_name } = map;
    const map_id = await get_map_id(map_name, project_name);
    const mapElementsQuery = `SELECT * FROM map_elements WHERE map = '${map_id}'`;
    const seatsGroupsQuery = `SELECT * FROM seats_groups WHERE map = '${map_id}'`;
    const tagBelongsQuery = `SELECT * FROM tag_belongs WHERE map = '${map_id}'`;
    const currentMapElements = await db_get(mapElementsQuery);
    const currentSeatsGroups = await db_get(seatsGroupsQuery);
    const currentTagBelongs = await db_get(tagBelongsQuery);
    mapElements.push(...currentMapElements);
    seatsGroups.push(...currentSeatsGroups);
    tagBelongs.push(...currentTagBelongs);
  }

  return {
    project: [{ name: project_name, id: project_id }],
    maps,
    guests,
    guestsGroups,
    guestsRequests,
    tags,
    seats,
    seatsBelongs,
    mapElements,
    seatsGroups,
    tagBelongs,
  };
};
function getAllIds(file) {
  const originalids = [];
  const fileEntries = Object.entries(file);
  fileEntries.forEach(([, value]) => {
    value.forEach((item) => {
      originalids.push(item.id);
    });
  });
  return originalids;
}
function createNewIds(idsList) {
  const newIdsList = {};
  idsList.forEach((id) => {
    newIdsList[id] = uuidv4();
  });
  return newIdsList;
}
projects.import = async function (request_body) {
  check_parameters(['file', 'name'], request_body);
  const file = JSON.parse(request_body.file);
  const newIds = createNewIds(getAllIds(file));
  const newProjectId = newIds[file.project[0].id];
  const newProjectName = request_body.name;

  async function createProject() {
    const query_string = `INSERT INTO projects (id, name) VALUES ('${newProjectId}', '${newProjectName}')`;
    await db_post(query_string);
  }
  async function createMaps(maps) {
    for (const map of maps) {
      const mapId = newIds[map.id];
      const query_string = `INSERT INTO maps(id, map_name, rows_number, columns_number, project) VALUES('${mapId}', '${map.map_name}', '${map.rows_number}', '${map.columns_number}', '${newProjectId}')`;
      await db_post(query_string);
    }
  }
  async function createGuests(guests) {
    for (const guest of guests) {
      const guestId = newIds[guest.id];
      const groupId = newIds[guest.guest_group];
      const query_string = `INSERT INTO guests(id, first_name, last_name, guest_group, project) VALUES('${guestId}', '${guest.first_name}', '${guest.last_name}', '${groupId}', '${newProjectId}');`;
      await db_post(query_string);
    }
  }
  async function createGuestsGroups(guestsGroups) {
    for (const group of guestsGroups) {
      const groupId = newIds[group.id];
      const query_string = `INSERT INTO guests_groups(id, name, color, score, project) VALUES('${groupId}', '${group.name}', '${group.color}', '${group.score}', '${newProjectId}')`;
      await db_post(query_string);
    }
  }
  async function createGuestsRequests(guestsRequests) {
    for (const request of guestsRequests) {
      const requestId = newIds[request.id];
      const requestValueId = newIds[request.request];
      const guestId = newIds[request.guest];
      const query_string = `INSERT INTO guests_requests(id, guest, request, project, index_key) VALUES('${requestId}', '${guestId}', '${requestValueId}', '${newProjectId}', '${request.index_key}')`;
      await db_post(query_string);
    }
  }
  async function createTags(tags) {
    for (const tag of tags) {
      const tagId = newIds[tag.id];
      const query_string = `INSERT INTO tags(id, name, color, score, project) VALUES('${tagId}', '${tag.name}', '${tag.color}', '${tag.score}', '${newProjectId}')`;
      await db_post(query_string);
    }
  }
  async function createTagBelongs(tagBelongs) {
    for (const belong of tagBelongs) {
      const belongId = newIds[belong.id];
      const mapId = newIds[belong.map];
      const tagId = newIds[belong.tag];
      const seatId = newIds[belong.seat];
      const query_string = `INSERT INTO tag_belongs(id, seat, tag, map) VALUES('${belongId}', '${seatId}', '${tagId}', '${mapId}');`;
      await db_post(query_string);
    }
  }
  async function createSeats(seats) {
    for (const seat of seats) {
      const seatId = newIds[seat.id];
      const mapId = newIds[seat.belong];
      const query_string = `INSERT INTO seats(id, belong, row_num, col_num, map, project) VALUES('${seatId}', '${mapId}', '${seat.row_num}', '${seat.col_num}', '${mapId}', '${newProjectId}');`;
      await db_post(query_string);
    }
  }
  async function createSeatsBelongs(seatsBelongs) {
    for (const belong of seatsBelongs) {
      const belongId = newIds[belong.id];
      const guestId = newIds[belong.guest];
      const seatId = newIds[belong.seat];
      const query_string = `INSERT INTO belong(id, guest, seat, project) VALUES('${belongId}', '${guestId}', '${seatId}', '${newProjectId}');`;
      await db_post(query_string);
    }
  }
  async function createSeatsGroups(seatsGroups) {
    for (const group of seatsGroups) {
      const groupId = newIds[group.id];
      const mapId = newIds[group.belong];
      const query_string = `INSERT INTO seats_groups(id, name, from_row, from_col, to_row, to_col, map) VALUES('${groupId}', '${group.group_name}', '${group.from_row}', '${group.from_col}', '${group.to_row}', '${group.to_col}', '${mapId}')`;
      await db_post(query_string);
    }
  }
  async function createMapElements(MapElements) {
    for (const element of MapElements) {
      const elementId = newIds[element.id];
      const mapId = newIds[element.map];
      const query_string = `INSERT INTO map_elements(id, name, from_row, from_col, to_row, to_col, map) VALUES('${elementId}', '${element.name}', '${element.from_row}', '${element.from_col}', '${element.to_row}', '${element.to_col}', '${mapId}')`;
      await db_post(query_string);
    }
  }
  await createProject();
  await createMaps(file.maps);
  await createGuests(file.guests);
  await createGuestsGroups(file.guestsGroups);
  await createGuestsRequests(file.guestsRequests);
  await createTags(file.tags);
  await createTagBelongs(file.tagBelongs);
  await createSeats(file.seats);
  await createSeatsBelongs(file.seatsBelongs);
  await createSeatsGroups(file.seatsGroups);
  await createMapElements(file.mapElements);
  console.log('👌👌👌👌');
};

export default projects;
