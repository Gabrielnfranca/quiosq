
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
}

export interface ParamsRequest {
    search?: string;
    page?: number;
    size?: number;
    orderBy?: string;
    direction?: string;
    numero?: string;
}

export interface ApiPageableResponse<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
}