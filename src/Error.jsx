import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

const Error = ({messages}) => {
    if (messages.length == 0) return null

    return messages.map(m => <p key={uuidv4()} aria-invalid="true" className="error">{m.message}</p>)
}

export default Error
