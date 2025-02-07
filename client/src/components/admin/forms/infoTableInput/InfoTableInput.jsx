import React, { useEffect, useState } from 'react'
import styles from './InfoTableInput.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faLeftLong, faRightLong, faUpLong } from '@fortawesome/free-solid-svg-icons';

const InfoTableInput = ({ tableDto, onComplete }) => {
      const [table, setTable] = useState({
            headers: tableDto?.headers || ['Attribute', 'Details'], 
            rows: tableDto?.rows || [] 
      });

      const handleHeaderChange = (index, value) => {
            const newHeaders = [...table.headers];
            newHeaders[index] = value;
            setTable({ ...table, headers: newHeaders});
      };

      const handleRowChange = (rowIndex, colIndex, value) => {
            const newRows = table.rows.map((row, index) =>  
                  index === rowIndex 
                        ?     row.map((cell, cellIndex) => (cellIndex === colIndex ? value : cell))
                        : row
            );
            setTable({ ...table, rows: newRows });
      };

      const handleAddHeader = () => {
            if(table.headers.length === 4) {
                  return;
            }
            const newHeaders = [...table.headers, ''];
            const newRows = table.rows.map((row) => [...row, '']);
            setTable({ ...table, headers: newHeaders, rows: newRows });
      }

      const handleRemoveHeader = () => {
            const newHeaders = [...table.headers.slice(0, -1)];
            const newRows = table.rows.map((row) => row.slice(0, -1));
            setTable({ ...table, headers: newHeaders, rows: newRows });
      }

      const handleAddRow = () => {
            setTable({ ...table, rows: [...table.rows, Array(table.headers.length).fill('')] });
      };

      const handleRemoveRow = () => {
            setTable({ ...table, rows: [...table.rows.slice(0, -1)] });
      }

      useEffect(() => {
            onComplete(table);
      }, [table]);

      useEffect(() => {
            if (table.headers.length < 2) {
                  const headersToAdd = 2 - table.headers.length;
                  for (let i = 0; i < headersToAdd; i++) {
                  handleAddHeader();
                  }
            }

            if(table.rows.length === 0) {
                  handleAddRow();
            }
      })

  return (
     <div className={styles.table_wrap}>
            <div className={styles.header_wrap}>
                  {table.headers.map((header, index) => (
                        <input
                         type="text"
                         maxLength={25}
                         minLength={8}
                         key={index}
                         value={header}
                         onChange={(e) =>{e.preventDefault(); handleHeaderChange(index, e.target.value)} }
                         placeholder={`Header ${index + 1}`}
                        />
                  ))}
                  <div className={styles.header_action_wrap}>
                        <button className={styles.add_btn} onClick={(e) => {e.preventDefault(); handleAddHeader()} }>
                        <FontAwesomeIcon icon={faRightLong}/>
                        </button>
                        <button className={styles.rm_btn} onClick={(e) => {e.preventDefault(); handleRemoveHeader()} }>
                        <FontAwesomeIcon icon={faLeftLong}/>
                        </button>
                  </div>
            </div>

            <div className={styles.rows_wrap}>
                  {table.rows.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.cell_wrap}>
                              {row.map((cell, cellIndex) => (
                                    <input 
                                      type="text"
                                      minLength={8}
                                      maxLength={100}
                                      key={cellIndex}
                                      value={cell}
                                      onChange={(e) => {e.preventDefault(); handleRowChange(rowIndex, cellIndex, e.target.value)} } 
                                    />
                              ))}
                        </div>
                  ))}
                  <div className={styles.row_action_wrap}>
                        <button className={styles.rm_btn} onClick={(e) => {e.preventDefault(); handleRemoveRow()} }>
                        <FontAwesomeIcon icon={faUpLong}/>
                        </button>
                        <button className={styles.add_btn} onClick={(e) => {e.preventDefault(); handleAddRow()} }>
                        <FontAwesomeIcon icon={faDownLong}/>
                        </button>
                  </div>
            </div>
      </div>
  )
}

export default InfoTableInput
