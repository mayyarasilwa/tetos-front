import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const APIURL = "https://tetos-api-75ss.onrender.com";

export const AXIOS = axios.create({
    baseURL: APIURL
});

export const QUERYCLIENT = new QueryClient();