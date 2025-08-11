// Context/DrawerContext.js
import React, { createContext, useState } from 'react';

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
};
