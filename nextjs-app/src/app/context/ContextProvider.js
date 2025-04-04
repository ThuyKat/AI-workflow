import React, {createContext,useContext,useState,useEffect} from 'react';

export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [history,setHistory] = useState([]);
    const [activeDocument,setActiveDocument] = useState(null);

    const addToHistory = (interaction) => {
        setHistory((prev)=>{
            setHistory(prev => [...prev,interaction])
        })
    }
    return (
        <Context.Provider value={{history,activeDocument,setActiveDocument,addToHistory}}>
            {children}
        </Context.Provider>
    )
}