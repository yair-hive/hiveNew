/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import api from 'renderer/api/api';
import { useHive } from '../app_hooks';
import HiveButton from '../hive_elements/hive_button';
import PopUp from '../hive_elements/pop_up';

function ProjectsPop({ id }) {
  const projects = api.projects.useData();
  const Hive = useHive();

  function onProjectClick() {
    Hive.closePopUp(id);
  }
  function onAddProject() {
    Hive.openPopUp('add_project');
    Hive.closePopUp(id);
  }

  function getProjectsList() {
    return projects.data?.map((project, index) => {
      return (
        <li key={index} onClick={onProjectClick}>
          <Link to={`/maps/${project.name}`}>{project.name}</Link>
        </li>
      );
    });
  }

  return (
    <PopUp id={id} title="פרויקטים">
      <ul dir="rtl">
        {getProjectsList()}
        <br />
        <HiveButton onClick={onAddProject}> הוסף פרויקט </HiveButton>
      </ul>
    </PopUp>
  );
}

export default ProjectsPop;
