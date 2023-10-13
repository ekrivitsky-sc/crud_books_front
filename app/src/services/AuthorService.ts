import http from "../http-common";
import IAuthorData from "../types/Author"

const getAll = (params?: any) => {
    return http.get<Array<IAuthorData>>("/authors", {
        params: params
    });
};

const get = (id: any) => {
    return http.get<IAuthorData>(`/authors/${id}`);
};

const create = (data: IAuthorData) => {
    return http.post<IAuthorData>("/authors", data);
};

const update = (id: any, data: IAuthorData) => {
    return http.put<any>(`/authors/${id}`, data);
};

const remove = (id: any) => {
    return http.delete<any>(`/authors/${id}`);
};

const findByName = (name: string) => {
    let params: any = {};

    if (name) {
        params["name"] = name;
    }

    return http.get<Array<IAuthorData>>(`/authors`, {
        params: params
    });
};

const AuthorService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByName
};

export default AuthorService;