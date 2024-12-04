import axios from "axios";

const APPLICATION_JSON = {
  accept: "application/json",
};

const APPLICATION_FORM_URLENCODED = {
  "Content-Type": "application/x-www-form-urlencoded",
};

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_RESTFUL_API_URL}:${
    import.meta.env.VITE_RESTFUL_API_PORT
  }`,
  headers: APPLICATION_JSON,
});

export { apiClient };
