import React, { useState } from 'react'

const TableInput = ({ tableDto, onComplete }) => {
      const [table, setTable] = useState({ headers: tableDto?.headers || [], rows: tableDto?.rows || [] });

      const handleHeaderChange = (index, value) => {
            const newHeaders = [...table.headers];
            newHeaders[index] = value;
            setTable({ ...table, headers: newHeaders});
            handleSubmit();
      };

      const handleRowChange = (rowIndex, colIndex, value) => {
            const newRows = table.rows.map((row, index) =>  
                  index === rowIndex 
                        ?     row.map((cell, cellIndex) => (cellIndex === colIndex ? value : cell))
                        : row
            );
            setTable({ ...table, rows: newRows });
            handleSubmit();
      };

      const handleAddHeader = () => {
            const newHeaders = [...table.headers, ''];
            const newRows = table.rows.map((row) => [...row, '']);
            setTable({ ...table, headers: newHeaders, rows: newRows });
            console.log(tableDto);
      }

      const handleAddRow = () => {
            setTable({ ...table, rows: [...table.rows, Array(table.headers.length).fill('')] });
      };

      const handleSubmit = () => {
            onComplete(table);
      };

  return (
    <div>
      <h3>Enter Table Data </h3>
      <div>
            <div>
                  {table.headers.map((header, index) => (
                        <input
                         type="text"
                         key={index}
                         value={header}
                         onChange={(e) => handleHeaderChange(index, e.target.value)}
                         placeholder={`Header ${index + 1}`}
                         style={{border: '1px solid black'}}
                        />
                  ))}
                  <button onClick={(e) => {e.preventDefault(); handleAddHeader()} }>
                  ⏯️
                  </button>
            </div>

            <div>
                  {table.rows.map((row, rowIndex) => (
                        <div key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                    <input 
                                      type="text"
                                      key={cellIndex}
                                      value={cell}
                                      onChange={(e) => handleRowChange(rowIndex, cellIndex, e.target.value)} 
                                      style={{border: '1px solid black'}}
                                    />
                              ))}
                        </div>
                  ))}
                  <button onClick={(e) => {e.preventDefault(); handleAddRow()}}>➕ Row</button>
            </div>
      </div>
    </div>
  );
};

export default TableInput
