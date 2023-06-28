import './style/top_bar.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHive } from './app_hooks';
import ProjectsPop from './components/projects_pop';
import AddProjectPop from './components/add_project_pop';
import ActionsDrop from './user_components/actions_drop';
import { useUserData } from './querys/users';
import LoginPop from './user_components/login_pop';
import SginupPop from './user_components/sginup_pop';

// function controls() {
//     const win = window.electron.window;

//     handleWindowControls();

//     window.onbeforeunload = () => {
//         win.removeAllListeners();
//     };

//     function handleWindowControls() {
//         document.getElementById("min-button").addEventListener("click", () => {
//             win.minimize();
//         });

//         document.getElementById("max-button").addEventListener("click", () => {
//             win.maximize();
//         });

//         document
//             .getElementById("restore-button")
//             .addEventListener("click", () => {
//                 win.unmaximize();
//             });

//         document
//             .getElementById("close-button")
//             .addEventListener("click", () => {
//                 win.close();
//             });

//         toggleMaxRestoreButtons();

//         function toggleMaxRestoreButtons() {
//             if (win.isMaximized()) {
//                 document.body.classList.add("maximized");
//             } else {
//                 document.body.classList.remove("maximized");
//             }
//         }
//     }
// }

function TopBar() {
  const user_name = useUserData();
  const { project_name } = useParams();

  // useEffect(() => {
  //     controls();
  // }, []);

  function get_user_name() {
    if (user_name.data) return user_name.data;
    return 'לא מחובר';
  }
  const Hive = useHive();

  const [drop, setDrop] = useState(false);

  return (
    <div className="top_bar">
      <div id="window-controls">
        <div className="button" id="min-button">
          <img
            className="icon"
            srcSet="../assets/icons/min-w-10.png 1x, ../assets/icons/min-w-12.png 1.25x, ../assets/icons/min-w-15.png 1.5x, ../assets/icons/min-w-15.png 1.75x, ../assets/icons/min-w-20.png 2x, ../assets/icons/min-w-20.png 2.25x, ../assets/icons/min-w-24.png 2.5x, ../assets/icons/min-w-30.png 3x, ../assets/icons/min-w-30.png 3.5x"
            draggable="false"
          />
        </div>

        <div className="button" id="max-button">
          <img
            alt=""
            className="icon"
            srcSet="../assets/icons/max-w-10.png 1x, ../assets/icons/max-w-12.png 1.25x, ../assets/icons/max-w-15.png 1.5x, ../assets/icons/max-w-15.png 1.75x, ../assets/icons/max-w-20.png 2x, ../assets/icons/max-w-20.png 2.25x, ../assets/icons/max-w-24.png 2.5x, ../assets/icons/max-w-30.png 3x, ../assets/icons/max-w-30.png 3.5x"
            draggable="false"
          />
        </div>

        <div className="button" id="restore-button">
          <img
            alt=""
            className="icon"
            srcSet="../assets/icons/restore-w-10.png 1x, ../assets/icons/restore-w-12.png 1.25x, ../assets/icons/restore-w-15.png 1.5x, ../assets/icons/restore-w-15.png 1.75x, ../assets/icons/restore-w-20.png 2x, ../assets/icons/restore-w-20.png 2.25x, ../assets/icons/restore-w-24.png 2.5x, ../assets/icons/restore-w-30.png 3x, ../assets/icons/restore-w-30.png 3.5x"
            draggable="false"
          />
        </div>

        <div className="button" id="close-button">
          <img
            alt=""
            className="icon"
            srcSet="../assets/icons/close-w-10.png 1x, ../assets/icons/close-w-12.png 1.25x, ../assets/icons/close-w-15.png 1.5x, ../assets/icons/close-w-15.png 1.75x, ../assets/icons/close-w-20.png 2x, ../assets/icons/close-w-20.png 2.25x, ../assets/icons/close-w-24.png 2.5x, ../assets/icons/close-w-30.png 3x, ../assets/icons/close-w-30.png 3.5x"
            draggable="false"
          />
        </div>
      </div>
      <div
        className="user_icon"
        onMouseOver={() => setDrop(true)}
        onMouseOut={() => setDrop(false)}
      >
        <div className={`user_name ${drop ? 'active' : ''}`}>
          <span>{get_user_name()}</span>
        </div>
        <ActionsDrop drop={drop} setDrop={setDrop} />
      </div>
      <div className="admin_link">
        <Link to="/admin">admin</Link>
      </div>
      <LoginPop id="login" />
      <SginupPop id="sginup" />
      <ul>
        <li>
          <div onClick={() => Hive.openPopUp('projects')}>פרויקטים</div>
        </li>
        <li>{project_name}</li>
      </ul>
      <ProjectsPop id="projects" />
      <AddProjectPop id="add_project" />
    </div>
  );
}

export default TopBar;
