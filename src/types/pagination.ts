export type Pagination<T> = {
	count: number;
	next: Nullable<string>;
	prev: Nullable<string>;
	results: T[];
};

export type PaginationParams = {
	offset: number;
	limit: number;
};

export type PaginationData<T> = Pagination<T> & {
	activePage: number;
	limit: number;
};

export type Error<T> = Partial<Record<keyof T, string>>;

export type Nullable<T> = T | null;
