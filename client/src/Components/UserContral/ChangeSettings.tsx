import React, {useEffect, useContext, useState } from "react";
import { AccountContext } from "./Account";

const Settings: React.FC = () => {
    const { getSession } = useContext(AccountContext);
    const [loggedIn, setLoggedIn ] = useState(false);

    useEffect(() => {
        getSession().then(() => {
            setLoggedIn(true)
        });
    },[]);
    

    return (
        <div className="settings">
            {loggedIn && (
                <>
                    <h2>Settings</h2>
                    <h4>Changing email</h4>
                    {/* <ChangePassword/><br/> */}
                    <hr/>
                    <h4>Changing email</h4>
                    {/* <ChangeEmail/> */}
                </>
            )}
        </div>
    );
};


export default Settings;