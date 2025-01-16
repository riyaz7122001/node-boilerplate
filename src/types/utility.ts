import { Request } from "express";
import { Transaction } from "sequelize";

export type ServerResponse = {
  success: boolean;
  message: string;
  data: any[];
  errors: any[];
};

export interface RequestWithPayload<T> extends Request {
  payload?: T;
  transaction?: Transaction;
}

export interface WithTransaction extends Request {
  transaction?: Transaction;
}

export type Falsy = null | undefined;

export type userRoles = "admin" | "user";
