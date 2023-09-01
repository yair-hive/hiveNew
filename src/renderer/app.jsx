/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import './style/app.css';
import { Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import Maps from './pages/maps';
import Guests from './pages/guests';
import Login from './pages/login';
import Home from './pages/home';
import Admin from './pages/admin';
import { HiveContext, useSocket } from './app_hooks';
import TitleBar from './components/titleBar/titleBar';
import { useSettingsData } from './api/useHiveFetch';

export const MBloaderContext = React.createContext(0);
export const EditContext = React.createContext('אל תערוך');
export const SelectablesContext = React.createContext(null);
export const ActionsContext = React.createContext(null);
export const BelongsContext = React.createContext(null);
export const GroupsContext = React.createContext(null);
export const TagsContext = React.createContext(null);
export const TableRefContext = React.createContext([]);
export const FixedContext = React.createContext([]);
export const SocketIdContext = React.createContext('');

function App() {
  const hiveSocket = useSocket();
  const queryClient = useQueryClient();
  const [MBloaderState, setMBloader] = useState(0);
  const editState = useState('אל תערוך');
  const selecteblsState = useState('cell');
  const actionsState = useState('numbers');
  const belongsState = useState('הכל');
  const groupsState = useState('הכל');
  const tagsState = useState('הכל');
  const [socketId, setSocketId] = useState('');
  const [popUps, setPopUps] = useState({});
  const [TableRefState, setTableRefState] = useState(null);
  const [fixedState, setfixedState] = useState(false);

  const settings = useSettingsData();

  function openPopUp(id) {
    setPopUps((prev) => {
      const the_new = { ...prev };
      the_new[id] = true;
      return the_new;
    });
  }
  function closePopUp(id) {
    setPopUps((prev) => {
      const the_new = { ...prev };
      the_new[id] = false;
      return the_new;
    });
  }

  useEffect(() => {
    hiveSocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.action == 'invalidate') {
        queryClient.invalidateQueries(data.query_key);
      }
      if (data.action == 'connection_id') {
        setSocketId(data.id);
      }
      if (data.action == 'progress') {
        setMBloader(data.progress);
        if (data.progress >= 100) data.progress = -1;
        // window.electron.sendProgress(data.progress);
      }
    };
    hiveSocket.onerror = (msg) => {
      console.log(msg);
    };
  }, [hiveSocket, queryClient]);

  useEffect(() => {
    function onEnter(event) {
      if (event.code == 'Enter') {
        document.activeElement.blur();
      }
    }
    document.addEventListener('keydown', onEnter);
    return () => document.removeEventListener('keydown', onEnter);
  }, []);

  const hive = {
    pop_ups: popUps,
    openPopUp,
    closePopUp,
  };

  if (!settings.data) return 'loading settings';

  return (
    <SocketIdContext.Provider value={socketId}>
      <HiveContext.Provider value={hive}>
        <BelongsContext.Provider value={belongsState}>
          <GroupsContext.Provider value={groupsState}>
            <TagsContext.Provider value={tagsState}>
              <ActionsContext.Provider value={actionsState}>
                <EditContext.Provider value={editState}>
                  <SelectablesContext.Provider value={selecteblsState}>
                    <MBloaderContext.Provider
                      value={[MBloaderState, setMBloader]}
                    >
                      <FixedContext.Provider
                        value={[fixedState, setfixedState]}
                      >
                        <TableRefContext.Provider
                          value={[TableRefState, setTableRefState]}
                        >
                          <Routes>
                            <Route
                              path="/maps/:project_name/:map_name"
                              element={<TitleBar />}
                            />
                            <Route
                              path="/maps/:project_name/*"
                              element={<TitleBar />}
                            />
                            <Route
                              path="/guests/:project_name/*"
                              element={<TitleBar />}
                            />
                            <Route path="*" element={<TitleBar />} />
                          </Routes>
                          <div
                            style={{
                              height: 'var(--title-bar-height)',
                              width: '100%',
                            }}
                          />
                          <div id="content" className="content">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route
                                path="/maps/:project_name/:map_name/*"
                                element={<Maps />}
                              />
                              <Route
                                path="/maps/:project_name/*"
                                element={<Maps />}
                              />
                              <Route
                                path="/guests/:project_name/*"
                                element={<Guests />}
                              />
                              <Route path="/admin/*" element={<Admin />} />
                              <Route path="login" element={<Login />} />
                            </Routes>
                          </div>
                        </TableRefContext.Provider>
                      </FixedContext.Provider>
                    </MBloaderContext.Provider>
                  </SelectablesContext.Provider>
                </EditContext.Provider>
              </ActionsContext.Provider>
            </TagsContext.Provider>
          </GroupsContext.Provider>
        </BelongsContext.Provider>
      </HiveContext.Provider>
    </SocketIdContext.Provider>
  );
}

export default App;
