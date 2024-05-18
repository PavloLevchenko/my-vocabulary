import axios from "axios";

axios.defaults.baseURL = "/api";
export const fetcher = (url: string) => axios.get(url).then(res => res.data);
