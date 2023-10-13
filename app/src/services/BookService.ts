import http from "../http-common";
import IBookData from "../types/Book"

const getAll = (params: any) => {
    params.with = [];
    params.with.push('authors', 'tags');
    return http.get<Array<IBookData>>("/books", {params});
};

const get = (id: any) => {
    let params: any = {};
    params.with = [];
    params.with.push('authors', 'tags');

    return http.get<IBookData>(`/books/${id}`, {params});
};

const create = (data: IBookData) => {
    return http.post<IBookData>("/books", data);
};

const update = (id: any, data: IBookData) => {
    return http.put<any>(`/books/${id}`, data);
};

const remove = (id: any) => {
    return http.delete<any>(`/books/${id}`);
};

const findByName = (name: string) => {
    let params: any = {};
    params.with = [];
    params.with.push('authors', 'tags');

    if (name) {
        params.name = name;
    }

    return http.get<Array<IBookData>>(`/books`, {params});
};

const BookService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByName
};

export default BookService;