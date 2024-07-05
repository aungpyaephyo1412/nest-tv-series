type sortOrder = 'desc' | 'asc';
export class UsersQueryDto {
  page?: number;
  perPage?: number;
  q?: string;
  sort?: {
    [key: string]: sortOrder;
  };
}
