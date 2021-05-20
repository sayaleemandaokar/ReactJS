import React, {useState} from "react";

import PackageContext from "./context";

const Provider = props => {
    const [misson, setMission] = useState({
        mname : "Go to Russia",
        agent : "007",
        accept: "Not accepted"
    });
    return(
        <PackageContext.Provider
        value={{
            data: misson, 
            isMissionAccepted : () =>{
                setMission({...misson, accept: "ACCEPTED"})
            }
        }}
        >
            {props.children}
        </PackageContext.Provider>
    )
}

export default Provider;

