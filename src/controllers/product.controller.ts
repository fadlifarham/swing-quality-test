import { Controller, Delete, Get, Post, Put } from "../decorators";
import { Request } from "express";
import Product from "../models/product.model";
import { _Request } from "../interfaces";
import { ErrorResponse, SuccessMessage } from "../utils";
import { FindOptions, WhereOptions, Op, OrderItem, Order, Options } from "sequelize";

interface RequestQueryParameter {
  filterBy?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}

@Controller("/products")
export default class ProductController {
  @Post(
    {
      path: "/",
      tag: "ProductController"
    },
    {
      responses: [
        {
          200: {
            description: "Response post object",
            responseType: "object",
            schema: "Product"
          }
        }
      ],
      request: "NewProduct"
    }
  )
  public async create(req: Request): Promise<Product> {
    const input: Product = req.body;

    const product = await Product.create(input);

    return product;
  }

  @Get(
    {
      path: "/",
      tag: "ProductController"
    },
    {
      responses: [
        {
          200: {
            description: "Response get object",
            responseType: "array",
            schema: "Product"
          }
        }
      ],
      parameters: [
        {
          in: "query",
          name: "filterBy",
          schema: {
            type: "string",
            enum: ["title"]
          },
          required: false
        },
        {
          in: "query",
          name: "search",
          schema: {
            type: "string"
          },
          required: false
        },
        {
          in: "query",
          name: "sortBy",
          schema: {
            type: "string",
            enum: ["title", "price"]
          },
          required: false
        },
        {
          in: "query",
          name: "orderBy",
          schema: {
            type: "string",
            enum: ["ASC", "DESC"]
          },
          required: false
        }
      ]
    }
  )
  public async gets(req: _Request): Promise<Product[]> {
    const { filterBy, search, sortBy, orderBy }: RequestQueryParameter = req.query;

    let where: WhereOptions = {};
    const order: Order = [];

    if (filterBy && search) {
      if (filterBy === "title") {
        where.title = { [Op.iLike]: `%${search}%` };
      }
    } else if (search) {
      where = {
        [Op.or]: [
          {
            title: { [Op.iLike]: `%${search}%` }
          },
          {
            url: { [Op.iLike]: `%${search}%` }
          },
          {
            description: { [Op.iLike]: `%${search}%` }
          }
        ]
      };
    }

    if (sortBy && orderBy) {
      order.push([sortBy, orderBy]);
    }

    const products = await Product.findAll({
      where,
      order,
      include: [
        {
          association: Product.associations.store
        }
      ]
    });

    return products;
  }

  @Get(
    {
      path: "/:id",
      tag: "ProductController"
    },
    {
      responses: [
        {
          200: {
            description: "Response get object",
            responseType: "object",
            schema: "Product"
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
  public async getById(req: Request): Promise<Product> {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id
      },
      include: [
        {
          association: Product.associations.store
        }
      ]
    });

    if (!product) throw new ErrorResponse(`Product with ID ${id} not found`, 404);

    return product;
  }

  @Put(
    {
      path: "/:id",
      tag: "ProductController"
    },
    {
      responses: [
        {
          200: {
            description: "Response put object",
            responseType: "object",
            schema: "Product"
          }
        }
      ],
      request: "NewProduct",
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
  public async update(req: _Request): Promise<Product> {
    const { id } = req.params;
    const input: Product = req.body;

    const product = await Product.findByPk(id);

    if (!product) throw new ErrorResponse(`Product with ID ${id} not found`, 404);

    const updatedProduct = await product.update(input);

    return updatedProduct;
  }

  @Delete(
    {
      path: "/:id",
      tag: "ProductController"
    },
    {
      responses: [
        {
          200: {
            description: "Response delete object",
            responseType: "object",
            schema: "Product"
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

    const product = await Product.findByPk(id);

    if (!product) throw new ErrorResponse(`Product with ID ${id} not found`, 400);

    await product.destroy();

    return { msg: `Product with ID ${id} successfully deleted` };
  }
}
