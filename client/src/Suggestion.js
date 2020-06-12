import React, {Component} from 'react';
import {Link, Router} from "@reach/router";
import PostSignature from "./PostSignature";
import moment from 'moment';


class Suggestion extends Component {
    render() {

        const signatureId = this.props.id;
        const suggestion = this.props.getSuggestion(this.props.id);
        let content = <p>Loading</p>;
        if (suggestion) {
            content =
                <>
                    <div>
                        <h1>{suggestion.suggestion} - {suggestion.fullname}</h1>
                        <h4>{suggestion.desc}</h4>
                        <p>Time of suggestion creation: {moment(suggestion.submitted).format('DD-MM-YYYY')}</p>
                        <h3>Signatures:</h3>
                        <ul>
                            {suggestion.signature.slice().sort((az, bz) => new Date(bz.time) - new Date(az.time))
                                .map(a =>  <li key={a.username}>{a.username} {moment(a.time).format('DD-MM-YYYY')} </li> )}
                        </ul>
                        <h5><PostSignature typo={this.props.typo} error={this.props.error} id={signatureId} postSignature={(id, text) => this.props.postSignature(id, text)}/></h5>
                        <Link to="/">Back</Link>
                    </div>
                </>
        }
        return content;
    }
}
export default Suggestion;