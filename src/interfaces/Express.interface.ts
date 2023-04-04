import {Request} from "express";
import User from "../models/user.model";

export interface _Request extends Request {
  user?: User
}
