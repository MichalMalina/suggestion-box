import {render} from "react-dom";
import ErrLogin from "./ErrLogin";

class AuthService {
    constructor(auth_api_url ) {
        this.auth_api_url = auth_api_url;
        this.state = { hasError: false , text:"something"};

    }

    async login(username, password) {
        const res = await this.fetch(this.auth_api_url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });
        let json = await res.json();
        if ([401, 404].includes(parseInt(res.status))) {
            throw this.state = {hasError: true} //Error(json.msg)



        }
        this.state = {hasError: false};
        console.log(this.state.hasError);
        this.setToken(json.token);
        this.setUsername(username);
        return json;
    }

    loggedIn() {
        // TODO: Check if token is expired using 'jwt-decode'
        // TODO: Install using 'npm install jwt-decode'
        /*
        if (jwtDecode(token).exp < Date.now() / 1000) {
            // Do something to renew token
        }
         */
        return (this.getToken() !== null);
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    getToken() {
        return localStorage.getItem("token");
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    }

    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        });
    }
}

export default AuthService;