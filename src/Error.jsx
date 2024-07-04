import * as React from 'react';

const Error = ({message}) => {
    if (!message) return null

    return <p>{message}</p>
}

export default Error
