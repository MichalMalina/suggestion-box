import React, {Component} from 'react';
import {Link} from "@reach/router";
import AuthService from './AuthService';
import {navigate} from "@reach/router";
import ErrLogin from "./ErrLogin";


class Login extends Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.ham = this.props.hasError;
        this.txt = this.props.text;
        this.state = {
            username: "",
            password: "",
        }
    }

    handleLogin() {
        console.log("login", this.state.username, this.state.password);
        this.props.login(this.state.username, this.state.password);

        if(localStorage.getItem("username") === null || localStorage.getItem("token") === null) {
            console.log("Username correct");


        }

        else { }
    }

    handleChange(event) {


        this.setState({
            [event.target.name]: event.target.value
        });


    }



    render() {
        var hidden = {
            display:"block"
        };

        var login = {
            margin:"10px 0px"
        };
        function show() {
            console.log("hereeeee");
            hidden = { display: "none"}
        }



let logErr = this.props.logErr ? <p>Username or password are wrong please try again</p> :<p></p>


        return (
            <>
                <h3 style={hidden}>Login</h3>





             //   {
            //        this.Auth.loggedIn() ? navigate(`http://localhost:3000/`) :
            //            <p>Not logged in</p>
                }

                {logErr}

                <input onChange={event => this.handleChange(event)}
                       name="username" type="text" placeholder="username"></input><br/>
                <input onChange={event => this.handleChange(event)}
                       name="password" type="password" placeholder="password"></input><br/>
                        <div   style={login}>
                       <button onClick={ _ => this.handleLogin()}>Login</button>

                        </div>


                <Link to="/">Back</Link>
            </>
        );
    }
}

export default Login;