import { Controller, Delete, Get, Post, Put } from "../decorators";
import { Request } from "express";
import Store from "../models/store.model";
import { _Request } from "../interfaces";
import { ErrorResponse, SuccessMessage } from "../utils";

@Controller("/stores")
export default class StoreController {
  @Post(
    {
      path: "/",
      tag: "StoreController"
    },
    {
      responses: [
        {
          200: {
            description: "Response post object",
            responseType: "object",
            schema: "Store"
          }
        }
      ],
      request: "NewStore"
    }
  )
  public async create(req: _Request): Promise<Store> {
    const input: Store = req.body;

    const store = await Store.create(input);

    return store;
  }

  @Get(
    {
      path: "/",
      tag: "StoreController"
    },
    {
      responses: [
        {
          200: {
            description: "Response get object",
            responseType: "array",
            schema: "Store"
          }
        }
      ]
    }
  )
  public async gets(): Promise<Store[]> {

    const stores = await Store.findAll();

    return stores;
  }

  @Get(
    {
      path: "/:id",
      tag: "StoreController"
    },
    {
      responses: [
        {
          200: {
            description: "Response get object",
            responseType: "object",
            schema: "Store"
          }
        }
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            id: {
              type: "number"
            }
          },
          required: true
        }
      ]
    }
  )
  public async getById(req: Request): Promise<Store> {
    const { id } = req.params;
    const store = await Store.findOne({
      where: {
        id
      }
    });

    if (!store) throw new ErrorResponse(`Store with ID ${id} not found`, 404);

    return store;
  }

  @Put(
    {
      path: "/:id",
      tag: "StoreController"
    },
    {
      responses: [
        {
          200: {
            description: "Response put object",
            responseType: "object",
            schema: "Store"
          }
        }
      ],
      request: "NewStore",
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "number"
          }
        }
      ]
    }
  )
  public async update(req: _Request): Promise<Store> {
    const { id } = req.params;
    const input: Store = req.body;

    const store = await Store.findByPk(id);

    if (!store) throw new ErrorResponse(`Store with ID ${id} not found`, 404);

    const updatedStore = await store.update(input);

    return updatedStore;
  }

  @Delete(
    {
      path: "/:id",
      tag: "StoreController"
    },
    {
      responses: [
        {
          200: {
            description: "Response delete object",
            responseType: "object",
            schema: "Store"
          }
        }
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          schema: {
            type: "number"
          }
        }
      ]
    }
  )
  public async delete(req: _Request): Promise<SuccessMessage> {
    const { id } = req.params;

    const store = await Store.findByPk(id);

    if (!store) throw new ErrorResponse(`Store with ID ${id} not found`, 400);

    await store.destroy();

    return { msg: `Store with ID ${id} successfully deleted` };
  }
}
