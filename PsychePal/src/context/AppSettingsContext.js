import React, { createContext, useContext } from 'react';

const AppSettingsContext = createContext(null);

export function useAppSettings() {
  const settings = useContext(AppSettingsContext);
  if (!settings) {
    throw new Error('App settings must be used within AppSettingsContext.Provider.');
  }
  return settings;
}

export default AppSettingsContext;
