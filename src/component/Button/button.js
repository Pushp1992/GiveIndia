import React from 'react';
import '../Button/button.css';

function Button(props) {
    const className = `button ${props.type}`
    return(
        <React.Fragment>
            <button className={className} value={props.value} onClick={props.handleClick}> {props.label} </button>
        </React.Fragment>
    )

}

export default Button;