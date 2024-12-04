import axios from "axios";
import { API_KEY, API_URL } from "./constants.ts";

const XAPIKEY = {
  "x-api-key": API_KEY,
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: XAPIKEY,
});

export { apiClient };
