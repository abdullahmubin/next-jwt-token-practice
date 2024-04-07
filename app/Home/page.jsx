"use client"

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
const Home = () => {

    const { data: session } = useSession();
    console.log({ session })

    return (
        <div>
            <h1 className="text-red-400">Denied</h1>
        </div>
    );
};

export default Home;