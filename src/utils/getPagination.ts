export interface IPagination<T> {
  itemsInPage: T[];
  hasMore: boolean;
  pages: number;
  totalItems: number;
}

export function getPagination<T>(
  list: T[],
  pageNumber = 1,
  count = 6,
): IPagination<T> {
  const start = (pageNumber - 1) * count;
  const end = start + count;
  const itemsInPage = list.slice(start, end);
  return {
    itemsInPage,
    hasMore: end < list.length,
    pages: Math.ceil(list.length / count),
    totalItems: list.length,
  };
}
