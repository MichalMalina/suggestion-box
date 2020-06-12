import React, {Component} from 'react';
import {Link} from "@reach/router";

class Suggestions extends Component {

    render() {


        const suggestionList = this.props.data.map((items) => (
                <li>
                    <Link key={items._id} to={`/suggestion/${items._id}`}> {items.suggestion}</Link><span> - (Signatures: {items.signature.length})</span>
                </li>
            )
        );
        return (
            <>

                    <h4>List of Suggestions:</h4>
                    <ol>
                        {suggestionList}
                    </ol>



            </>
        );
    }
}
export default Suggestions;