/* eslint-disable camelcase */
import express from 'express';

import maps from './api/maps.js';
import seats from './api/seats.js';
import guests from './api/guests.js';
import tags from './api/tags.js';
import users from './api/users.js';
import map_elements from './api/map_elements.js';
import projects from './api/projects.js';
import guest_groups from './api/guest_groups.js';
import seat_belongs from './api/seat_belongs.js';
import seats_groups from './api/seats_groups.js';
import tag_belongs from './api/tag_belongs.js';
import requests_belongs from './api/requests_belongs.js';

const router = express.Router();

const actions = {
  maps,
  seats,
  guests,
  tags,
  map_elements,
  projects,
  guest_groups,
  seat_belongs,
  seats_groups,
  tag_belongs,
  requests_belongs,
  users,
};

router.post('/', async (req, res) => {
  const { category, action } = req.body;
  try {
    if (!category || !action) {
      throw new Error('parameter misseng');
    }
    if (category.length === 0 || action.length === 0) {
      throw new Error('parameter misseng');
    }
    if (!actions[category]) {
      throw new Error('category dont exists');
    }
    if (!actions[category][action]) {
      throw new Error('action dont exists');
    }
    const respons = {
      data: await actions[category][action](req.body, req),
      msg: 'ok',
    };
    res.json(respons);
  } catch (error) {
    res.status(500).json({ msg: false, data: error });
  }
});

export default router;
