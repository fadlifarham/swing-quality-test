import { Optional, Sequelize, DataTypes, QueryInterface, ModelAttributes, Association } from "sequelize";
import { BaseModel } from "../utils";

import { Schemas } from "../keys/apidoc";
import Store from "./store.model";
export interface ProductAttributes {
  id: number;
  title: string;
  url: string;
  price: number;
  description: string;
  store_id: number;
}

export type ProductCreationAttributes = Optional<ProductAttributes, "id">;

export class Product extends BaseModel<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public static readonly tableName = "MT_Product";
  public static readonly modelName = "Product";
  public static readonly modelNamePlural = "Products";
  public static readonly defaultScope = {};
  public id!: number;
  public title: string;
  public url: string;
  public price: number;
  public description: string;
  public store_id: number;

  // Association
  public store?: Store;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public static associations: {
    store: Association<Product, Store>;
  };

  public static setAssociation(): void {
    this.belongsTo(Store, { foreignKey: "store_id", as: "store" });
  }

  public static tableDefinitions: ModelAttributes<Product, ProductAttributes> = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    store_id: DataTypes.INTEGER
  };

  public static modelInit(sequlize: Sequelize): void {
    this.init(this.tableDefinitions, {
      sequelize: sequlize,
      tableName: this.tableName,
      name: {
        singular: this.modelName,
        plural: this.modelNamePlural
      },
      defaultScope: this.defaultScope,
      comment: "Model for the accessible data of Line",
      paranoid: true
    });
  }

  public static createTable(query: QueryInterface): Promise<void> {
    return query.createTable(this.tableName, {
      ...this.tableDefinitions,
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    });
  }

  public static dropTable(query: QueryInterface): Promise<void> {
    return query.dropTable(this.tableName);
  }
}

export const swaggerSchemas: Schemas[] = [
  {
    Product: {
      title: "",
      properties: {
        title: {
          type: "string"
        },
        url: {
          type: "string"
        },
        price: {
          type: "number"
        },
        description: {
          type: "string"
        },
        store_id: {
          type: "number"
        }
      }
    },
    NewProduct: {
      title: "",
      properties: {
        title: {
          type: "string"
        },
        url: {
          type: "string"
        },
        price: {
          type: "number"
        },
        description: {
          type: "string"
        },
        store_id: {
          type: "number"
        }
      }
    }
  }
];

export default Product;
