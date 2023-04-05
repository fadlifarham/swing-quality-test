import { Request } from "express";

/**
 *
 * @param req is Request
 * @default limit = 20
 * @default pagination = 1
 */
export const createPaginationOptions = (req: Request): PaginationOptions => {
  const {
    pagination,
    limit
  } = req.query;

  if (!pagination) return {} as PaginationOptions;

  let formatedPage = parseInt(pagination as string, 10) || 1;
  let formatedLimit = parseInt(limit as string, 10) || 20;
  const paginations = new PaginationOptions();

  if (formatedPage <= 0) {
    formatedPage = 1;
  }
  if (formatedLimit <= 0) {
    formatedLimit = 20;
  }

  // paginations.pagination = formatedPage;
  paginations.limit = formatedLimit;
  paginations.offset = (formatedPage - 1) * formatedLimit;

  return paginations;
};

export class PaginationOptions {
  // pagination: number;
  limit: number
  offset: number
}

export class Pagination {
  pagination: number
  limit: number
  totalPage: number
  count: number

  constructor(total: number, paginationOptions: PaginationOptions) {
    // this.pagination = Number(paginationOptions.pagination);
    this.limit = Number(paginationOptions.limit);
    this.totalPage = Math.ceil(total / paginationOptions.limit);
    this.count = total;
  }
}
