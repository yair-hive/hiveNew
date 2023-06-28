import React, { useContext } from 'react';

export const HiveContext = React.createContext({});
export const HiveSocket = React.createContext(null);

export function useHive() {
  return useContext(HiveContext);
}

export function useSocket() {
  return useContext(HiveSocket);
}
