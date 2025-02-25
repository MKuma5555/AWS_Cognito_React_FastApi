import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./UserContral/Account"
import Modal from "./Modal"

function TopPage() {

    const [status, setStatus] = useState(false);

    const { getSession, logout, user } = useContext(AccountContext);

    console.log("check check: ", user);

    useEffect(() => {
        getSession().then((session) => {
            console.log("session: ", session);
            setStatus(true);
        });
    }, []);

    return (
        <>
            <p>This is TOP page</p>
            <p> Hello</p>
            <p>Name: {user.name}</p>
            <Modal />
        </>
    );
}

export default TopPage


