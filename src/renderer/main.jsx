import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './app';
import { HiveSocket } from './app_hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const ws = new WebSocket('ws://localhost:3025');

function Main() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <HiveSocket.Provider value={ws}>
            <App />
            <ReactQueryDevtools />
          </HiveSocket.Provider>
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default Main;
