/* eslint-disable import/no-cycle */
import guestGroup from './guest_groups';
import guests from './guests';
import mapElements from './map_elements';
import maps from './maps';
import projects from './projects';
import requestsBelongs from './requests_belongs';
import seatBelongs from './seat_belongs';
import seatsGroups from './seats_groups';
import seats from './seats';
import tagBelongs from './tag_belongs';
import tags from './tags';

const api = {
  seatsGroups,
  guestGroup,
  guests,
  mapElements,
  maps,
  projects,
  requestsBelongs,
  seatBelongs,
  seats,
  tagBelongs,
  tags,
};

export default api;
