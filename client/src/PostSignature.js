import React, {Component} from 'react';
import AuthService from './AuthService';

class PostSignature extends  Component{
    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            input: "",
            theError: false,
            typoErr:false,
            signatureErr:false,
        }
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit() {
        this.props.postSignature(this.props.id, this.state.input);
        if(localStorage.getItem("username") === null || localStorage.getItem("token") === null) {
            console.log("Not logged in");
            this.setState({theError:true})

        }

        else { this.setState({theError:false})}




    }

    render() {
        let typoErr = this.props.typo ? <p>Wrong username</p> : <p></p>;
        let showErr = this.state.theError ?
            <p>Must be logged in to submit signature</p> : <p></p>;

        return (
            <>
                {typoErr}
                {duplicateErr}
                {showErr}
                <input placeholder="please write your username" name="input" onChange={  event => this.onChange(event ) } type="text"/>
                <button onClick={ _ => this.onSubmit() }>Add your Signature</button>
            </>
        )
    }
}
export default PostSignature;