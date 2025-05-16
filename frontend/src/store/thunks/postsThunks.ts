import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "../types";
import axios from "axios";

// Thunk para obtener los posts
export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
    const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts'); // usando axios solo
    // const response = useAxios({ url: "/posts", method: "GET" }); // no puedo hacer esto (hook de useAxios) xq los hooks solo se llaman dentro del cuerpo de componentes
    // const response = await request<Post[]>({ url: "https://jsonplaceholder.typicode.com/posts", method: "GET" }); // llamado mediante funcion asincrona que usa apiClient.ts

    return response.data;
});