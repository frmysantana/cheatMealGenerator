import * as React from 'react';

const Error = ({message}) => {
    if (!message) return null

    return <p aria-invalid="true" className="error">{message}</p>
}

export default Error
