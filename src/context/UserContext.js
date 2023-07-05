import { createContext, useState } from "react";


export const UserContext = createContext()

export const UserProvider = (props) => {
    
    return ( 
        <UserContext.Provider >
            {props.children}
        </UserContext.Provider>
     );
}