/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './app';
import { HiveSocket } from './app_hooks';
import { useSettingsData } from './api/useHiveFetch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function Main() {
  const settings = useSettingsData();
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3025'));

  useEffect(() => {
    if (settings.data) {
      setWs(
        new WebSocket(
          `ws://${settings.data.serverHost}:${settings.data.serverPort}`
        )
      );
    }
  }, [settings.data]);
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <HiveSocket.Provider value={[ws, setWs]}>
            <App />
            <ReactQueryDevtools />
          </HiveSocket.Provider>
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default Main;
