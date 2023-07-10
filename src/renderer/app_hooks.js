/* eslint-disable consistent-return */
import React, { useContext } from 'react';

export const HiveContext = React.createContext({});
export const HiveSocket = React.createContext(null);

export function useHive() {
  return useContext(HiveContext);
}

export function useSocket() {
  const socketContext = useContext(HiveSocket);
  if (socketContext.length > 1) return socketContext[0];
}
