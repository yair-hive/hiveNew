// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

const electronHandler = {
  sendProgress: (number: number) => ipcRenderer.send('update_progress', number),
  getSettings: () => ipcRenderer.invoke('get-settings'),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
