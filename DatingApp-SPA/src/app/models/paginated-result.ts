import { Pagination } from './pagination.interface';

export class PaginatedResult<T> {
  result: T;
  pagination: Pagination;
}
