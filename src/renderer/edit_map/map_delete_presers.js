/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
export const map_delete_presers = {
  seats() {
    const selected = document.querySelectorAll('.selected');
    const seats_ids = [];
    for (const seat of selected) {
      const seat_id = seat.getAttribute('seat_id');
      seats_ids.push(seat_id);
    }
    return seats_ids;
  },
  elements() {
    const selected = document.querySelectorAll('.selected');
    const elements_ids = [];
    for (const element of selected) {
      const element_id = element.getAttribute('element_id');
      elements_ids.push(element_id);
    }
    return elements_ids;
  },
  groups() {
    const selected = document.querySelectorAll('.selected');
    const elements_ids = [];
    for (const element of selected) {
      const element_id = element.getAttribute('group_id');
      elements_ids.push(element_id);
    }
    return elements_ids;
  },
};
