import React from 'react'

const ShowTable = ({ tableDto}) => {
  if(!tableDto || !tableDto.headers || !tableDto.rows) {
    return (
      <p>No table to show! </p>
    );
  }

  return (
    <div>
      <h1>Table Info: </h1>
      <table style={{borderCollapse: 'collapse', width: '100%'}}>
        <thead>
          <tr>
            {tableDto?.headers?.map((header, index) => (
              <th key={index} style={{border: '1px solid black', padding: '8px'}}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableDto?.rows?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ border: '1px dotted black', padding: '8px' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowTable
