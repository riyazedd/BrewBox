import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login: builder.mutation({
            query:(data)=>({
                url:USERS_URL/login,
                method:'POST',
                bode:data,
            })
        })
    })
})

export const { useLoginMutation } = usersApiSlice;