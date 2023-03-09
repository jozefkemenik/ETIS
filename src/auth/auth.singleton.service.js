import AuthService from '@/auth/auth.service';
import Vue from "vue";

class AuthSingletonService extends AuthService {
    constructor() {
        super();
        this.headers = {
            'Content-Type': 'application/json;charset=utf-8'
        };
    }
    httpGet(url, payload, isAuthorize = true) {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (isAuthorize) {
                this.getToken().then((token) => {
                    if (token) {
                        Vue.http.get(this.baseUrl + "/" + url, { params: payload, headers: _this.getHeaders(token) })
                            .then(response => resolve(response),
                                (e) => {
                                    this.makeToast(null, "Internal Server Error");
                                    reject(e)
                                }

                            )
                            .catch(
                                (e) => {
                                    this.makeToast(null, "A problem on server side occurs");
                                    reject(e);
                                })
                    }
                })

            }
            else {
                Vue.http.get(this.baseUrl + "/" + url, { params: payload, headers: _this.getHeaders() })
                    .then(response => resolve(response),
                        (e) => {

                            if (e) {
                                this.makeToast("Information", e.body);
                            } else {
                                this.makeToast(null, "Internal Server Error");
                            }
                            reject(e)
                        }
                    )
                    .catch((e) => {
                        this.makeToast(null, "A problem on server side occurs");
                        reject(e);
                    })
            }
        });
    }
    httpPost(url, payload, isAuthorize = true) {
        return this.httpGen("post", url, payload, isAuthorize);
    }

    httpPatch(url, payload, isAuthorize = true) {
        return this.httpGen("patch", url, payload, isAuthorize);
    }

    httpDelete(url, payload, isAuthorize = true) {
        return this.httpGen("delete", url, payload, isAuthorize);
    }



    httpGen(type, url, payload, isAuthorize) {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (isAuthorize) {
                this.getToken().then((token) => {
                    if (token) {
                        if (type == "delete") {
                            Vue.http.delete(this.baseUrl + "/" + url, { body: payload, headers: _this.getHeaders(token) })
                                .then(response => resolve(response),
                                    (e) => {
                                        if (e && e.body) {
                                            this.makeToast("Information", e.body);
                                        } else {
                                            this.makeToast(null, "Internal Server Error");
                                        }
                                        reject(e)
                                    }
                                )
                                .catch((e) => {
                                    this.makeToast(null, "A problem on server side occurs");
                                    reject(e);
                                })


                        } else {
                            Vue.http[type](this.baseUrl + "/" + url, payload, { headers: _this.getHeaders(token) })
                                .then(response => resolve(response),
                                    (e) => {
                                        if (e && e.body) {
                                            this.makeToast("Information", e.body);
                                        } else {
                                            this.makeToast(null, "Internal Server Error");
                                        }
                                        reject(e)
                                    }
                                )
                                .catch((e) => {
                                    this.makeToast(null, "A problem on server side occurs");
                                    reject(e);
                                })
                        }
                    }
                });
            } else {


                if (type == "delete") {

                    Vue.http.delete(this.baseUrl + "/" + url, { body: payload, headers: _this.getHeaders() })
                        .then(response => resolve(response),
                            (e) => {
                                if (e && e.body) {
                                    this.makeToast("Information", e.body);
                                } else {
                                    this.makeToast(null, "Internal Server Error");
                                }
                                reject(e)
                            }
                        )
                        .catch((e) => {
                            this.makeToast(null, "A problem on server side occurs");
                            reject(e);
                        })

                } else {

                    Vue.http[type](this.baseUrl + "/" + url, payload, { headers: _this.getHeaders() })
                        .then(response => resolve(response),
                            (e) => {
                                if (e && e.body) {
                                    this.makeToast("Information", e.body);
                                } else {
                                    this.makeToast(null, "Internal Server Error");
                                }
                                reject(e)
                            }
                        )
                        .catch((e) => {
                            this.makeToast(null, "A problem on server side occurs");
                            reject(e);
                        })
                }
            }
        })
    }



    fetch(url) {
        return new Promise((resolve, reject) => {

            this.getToken().then((token) => {
                if (token) {

                    const headers = new Headers(this.getHeaders(token));
                    const options = {
                        headers
                    };

                    fetch(url, options)
                        .then(response => resolve(response), e => reject(e))
                        .catch(e => {
                            reject(e);
                        });
                } else {
                    reject();
                }
            });

        });
    }





}
export default new AuthSingletonService();