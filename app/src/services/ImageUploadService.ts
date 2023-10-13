import http from "../http-common";

const upload = (file: any, url: string) => {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export default {
    upload
};
