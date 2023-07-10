/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import api from 'renderer/api/api';
import { FixedContext, MBloaderContext } from '../app';
import AddMapPop from '../components/add_map_pop';
import HiveButton from '../hive_elements/hive_button';
import { ShowScoreContext } from './maps';
import { useHive, useSocket } from '../app_hooks';

function ProjectSM() {
  const { map_name, project_name } = useParams();

  const [MBstatus, setMBStatus] = useContext(MBloaderContext);
  const [showScore, setShowScore] = useContext(ShowScoreContext);

  const hiveSocket = useSocket();
  const queryClient = useQueryClient();
  const [fixedState, setfixedState] = useContext(FixedContext);
  const hive = useHive();

  const scheduling = api.projects.useScheduling();

  return (
    <div className="sub_menu">
      <Link to={`/guests/${project_name}`}>
        <HiveButton>שמות</HiveButton>
      </Link>
      <HiveButton onClick={scheduling}> שבץ </HiveButton>
      <HiveButton onClick={() => hive.openPopUp('add_map')}>
        {' '}
        הוסף מפה{' '}
      </HiveButton>
      <HiveButton onClick={() => setfixedState(!fixedState)}>
        {' '}
        ניהול מקומות קבועים{' '}
      </HiveButton>
      <HiveButton onClick={() => setShowScore(!showScore)}>
        {' '}
        הצג ניקוד{' '}
      </HiveButton>
      <AddMapPop id="add_map" />
    </div>
  );
}

export default ProjectSM;
