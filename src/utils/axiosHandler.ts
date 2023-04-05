import Axios, { AxiosInstance } from "axios";
import { envConfig } from ".";
import { Request } from "express";

const {
  SECRET_KEY
} = envConfig;

export const getBaseUrl = (req: Request): string => {
  const protocol = req.protocol == "http" ? "http://" : "https://";
  return `${protocol}${req.headers.host}`;
};

export const axios = (req: Request | string): AxiosInstance => {
  let baseUrl = "";
  if (typeof req == "string") {
    baseUrl = req;
  } else {
    baseUrl = getBaseUrl(req);
  }
  const myAxios = Axios.create({
    baseURL: `${baseUrl}/api/v1`,
  });
  myAxios.defaults.headers.common["x-secret"] = SECRET_KEY;
  return myAxios;
};
