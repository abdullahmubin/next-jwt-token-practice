import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/app/lib/axios";
// import axios from 'axios'
// import User from "@/app/(models)/User";
// import bcrypt from "bcrypt";

export const options = {
    providers: [
        GitHubProvider({
            profile(profile) {
                // console.log("Profile GitHub: ", profile);

                let userRole = "GitHub User";
                if (profile?.email == "jake@claritycoders.com") {
                    userRole = "admin";
                }

                return {
                    ...profile,
                    role: userRole,
                };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_Secret,
        }),
        GoogleProvider({
            profile(profile) {
                // console.log("Profile Google: ", profile);

                let userRole = "Google User";
                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole,
                };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_Secret,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email:",
                    type: "text",
                    placeholder: "your-email",
                },
                password: {
                    label: "password:",
                    type: "password",
                    placeholder: "your-password",
                },
            },
            async authorize(credentials, req) {

                const res = await axios.post("/api/Auth/login", {
                    username: credentials?.email,
                    password: credentials?.password
                })
                const user = { id: "1", name: "J Smith", email: res.data, accessToken: res.data }

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }

                // console.log('authzized')
                // console.log(credentials)
                // const res = await axios.post("https://localhost:7220/api/Auth/login", {
                //     username: credentials?.email,
                //     password: credentials?.password
                // })
                // console.log(res)
                // let user = {
                //     name: 'test',
                //     token: res.data
                // }
                // return user;
                // return {
                //     // ...profile,
                //     id: credentials?.email,
                //     token: res.data
                //     // role: userRole,
                // };
                // const response = await fetch("https://localhost:7220/api/Auth/login", {
                //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
                //     headers: {
                //         'Content-Type': 'application/json'
                //         // 'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     body: JSON.stringify({ username: 'username', password: "password" }) // body data type must match "Content-Type" header
                // });

                // var ret = await response.json()
                // fetch('https://jsonplaceholder.typicode.com/todos/1')
                //     .then(response => response.json())
                //     .then(json => console.log(json))


                // const user = res.data;

                // console.log('user');
                // console.log(user);
                // try {
                //     const foundUser = await User.findOne({ email: credentials.email })
                //         .lean()
                //         .exec();

                //     if (foundUser) {
                //         console.log("User Exists");
                //         const match = await bcrypt.compare(
                //             credentials.password,
                //             foundUser.password
                //         );

                //         if (match) {
                //             console.log("Good Pass");
                //             delete foundUser.password;

                //             foundUser["role"] = "Unverified Email";
                //             return foundUser;
                //         }
                //     }
                // } catch (error) {
                //     console.log(error);
                // }
                // return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            // console.log('token');
            // console.log(token);
            // console.log(user);

            // if (user) token.role = user.role;
            // return token;

            return { ...token, ...user }
        },
        async session({ session, token, user }) {
            // console.log('session');
            // console.log(session);
            // console.log(token)
            if (session?.user) session.user.role = token.role;

            session.user = token;
            return session;
        },
    },
};