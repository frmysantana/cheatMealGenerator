import * as React from 'react';

const Results = ({results}) => {
    if (!results || results.length == 0) {
        return null;
    }

    return (
        <table>
          <caption>
            Meals
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r =>
                <tr key={r.id}>
                  <td>
                    {r.name}
                  </td>
                  <td>
                    {r.calories}
                  </td>
                </tr>
            )}
          </tbody>
        </table>
    )
}

export default Results