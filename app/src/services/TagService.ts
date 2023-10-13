import http from "../http-common";
import ITagData from "../types/Tag"

const getAll = (params?: any) => {
    return http.get<Array<ITagData>>("/tags", {params});
};

const get = (id: any) => {
    return http.get<ITagData>(`/tags/${id}`);
};

const create = (data: ITagData) => {
    return http.post<ITagData>("/tags", data);
};

const update = (id: any, data: ITagData) => {
    return http.put<any>(`/tags/${id}`, data);
};

const remove = (id: any) => {
    return http.delete<any>(`/tags/${id}`);
};

const findByName = (name: string) => {
    let params: any = {}

    if (name) {
        params["name"] = name
    }
    return http.get<Array<ITagData>>(`/tags`, {params});
};

const TagService = {
    getAll,
    get,
    create,
    update,
    remove,
    findByName,
};

export default TagService;