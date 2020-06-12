
import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import AuthService from './AuthService';
import Suggestions from "./Suggestions";
import Suggestion from "./Suggestion";
import Login from './Login';
import ErrLogin from "./ErrLogin";
import { Link, Router } from "@reach/router"
import PostSignature from "./PostSignature";


class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;
   
    constructor(props) {
        super(props);
        // Initialize the auth service with the path of the API authentication route.
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            suggestions: [],
            signatureErr:false,
            typoErr:false,
            logErr:false
        };
    }

    componentDidMount() {
        // Get everything from the API
        this.getData().then(() => console.log("Suggestions aquiered"));
    }


    async login(username, password) {
        try {
            const resp = await this.Auth.login(username, password);
            console.log("Authentication:", resp.msg);
            this.getData();
            this.setState({
                logErr: false
            });
        } catch (e) {
            console.log("Login", e);
            this.setState({
                logErr: true
            });
        }
    }

    async logout(event) {
        // TODO
    }

    async getData() {
        const resp = await this.Auth.fetch(`${this.API_URL}/suggestions`);
        const data = await resp.json();
        this.setState({
            suggestions: data
        });
    }

    getSuggestion(id) {
        //  const findFunction = question => question.id === parseInt(id);
        // return this.state.questions.find(findFunction);
        return this.state.suggestions.find(k => k._id === id);
    }

    getUser(user) {
        //  const findFunction = question => question.id === parseInt(id);
        // return this.state.questions.find(findFunction);
        return this.state.suggestions.find(k => k.fullname === user);
    }

    /*
    async NewQuestion(ques) {
        const request = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ques: ques , answ:[]})
        };
        const response = await fetch(`${this.API_URL}/questions/`, request);
        const data = await response.json();
        this.getData();
        console.log(data);
    }
*/
    async postSignature(id, text) {
        let getToken = localStorage.getItem("token");
        let getUsername = localStorage.getItem("username");
        if(text === getUsername) {
            this.setState({typoErr:false});
            if (this.state.suggestions.some( items => (items.suggestions === text)) ) {

                console.log("postSignature", id, text);
                const url = `${this.API_URL}/suggestions/${id}`;
                const response = await this.Auth.fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken}`},
                    body: JSON.stringify({username: text})
                });
                const data = await response.json();
                this.getData();
                console.log("Printing the response:", data);
                this.setState({signatureErr:false});
            }
            else {
                console.log("You already submitted a signature for this suggestion");
                this.setState({signatureErr:true});
            }
        }
        else {console.log("Wrong username"); this.setState({typoErr:true});}
    }



    render() {
        // TODO: This app should render a Login component when the user is not logged in.
        // TODO: Also, implement such a Login component.
        const container = {
            color: "white",
            padding: "20px 20px",
            fontFamily: "Arial"
        };
        const bold = {
            fontWeight:"bold"
        };


        return (
            <>
                <div style={container}>


            <div className="container">
                <h1>Suggestions</h1>
                {
                    this.Auth.loggedIn() ? <p>Logged in as {localStorage.getItem("username")} <br></br> <button onClick={_ => this.Auth.logout()}>Logout</button> need to reload page after click </p> :
                    <p>Not logged in , <Link to="/login">Login</Link> </p>
                }


            </div>


            <Router>
                <Login logErr={this.state.logErr} check={this.Auth.loggedIn()} path="/login" login={(username, password) => this.login(username, password)}/>
                <Suggestions path="/" data={this.state.suggestions} changeDone={index => this.changeDone(index)}></Suggestions>
                <Suggestion path="/suggestion/:id" typo={this.state.typoErr} error={this.state.signatureErr}  data={this.state.suggestions} postSignature={(id, text) => this.postSignature(id, text)} getSuggestion={id =>this.getSuggestion(id)}></Suggestion>
            </Router>
                </div>

</>
        );
    }
}

export default App;
