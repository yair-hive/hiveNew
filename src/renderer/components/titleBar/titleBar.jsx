/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import DropDown from '../dropDown/dropDown';
import WindowControls from '../windowControls/windowControls';
import './titleBar.css';
import { useProjectsData } from '../../querys/projects';
import RollingList from '../../hive_elements/rolling_list';
import { useNavigate, useParams } from 'react-router-dom';
import AddProjectPop from '../add_project_pop';
import { useHive } from '../../app_hooks';

function ProjectsDrop({ open }) {
  const projectsData = useProjectsData();
  const navigate = useNavigate();
  const hive = useHive();

  function renderProjects() {
    if (!open) return;
    if (projectsData.isLoading) return 'טוען';
    const projectsList = projectsData.data.map((project) => {
      return { name: project.name, value: project.name };
    });
    projectsList.push({
      name: 'הוסף פרוייקט',
      value: 'add project',
      onClick: () => hive.openPopUp('add_project'),
    });
    return (
      <RollingList
        items={projectsList}
        onItemClick={(item) => navigate(`/maps/${item.value}`)}
      />
    );
  }
  return <DropDown open={open}>{renderProjects()}</DropDown>;
}

function TitleBar() {
  const [projects, setProjects] = useState(false);
  const { map_name, project_name } = useParams();

  return (
    <div className="title-bar">
      {/* <WindowControls /> */}
      <div className="app-icon" />
      <div className="options" draggable="false">
        <div className="option">
          <div className="option-title"> הגדרות </div>
        </div>
        <div className="option">
          <div className="option-title"> חלון </div>
        </div>
        <div
          className="option"
          onMouseOver={() => setProjects(true)}
          onMouseOut={() => setProjects(false)}
        >
          <div className="option-title">פרוייקטים</div>
          <ProjectsDrop open={projects} />
        </div>
        <AddProjectPop id="add_project" />
      </div>
      <div className="title-line">
        {`${project_name ? `project: ${project_name} ` : ''}`}
        {`${map_name ? `| map: ${map_name} ` : ''}`}
      </div>
    </div>
  );
}

export default TitleBar;
