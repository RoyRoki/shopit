import React from 'react'
import styles from './ProductHeroTable.module.css'

const ProductHeroTable = ({ tableDto }) => {
  return (
    <div className={styles.main_table}>
      { tableDto.headers?.length !== 0 ? (
        <table className={styles.table_wrap}>
          <thead className={styles.table_head}>
            <tr className={styles.table_header_row}>
              {tableDto?.headers?.map((header, index) => (
                <th className={styles.table_header} key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {tableDto?.rows?.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.table_body_row}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={styles.table_body_data}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className={styles.demo_table_wrap}>
          <thead className={styles.demo_table_head}>
            <tr className={styles.demo_table_header_row}>
                <th className={styles.demo_table_header}>
                  create 
                </th>
                <th className={styles.demo_table_header}>
                  information table
                </th>
            </tr>
          </thead>
          <tbody className={styles.demo_table_body}>
              <tr className={styles.demo_table_body_row}>
                  <td className={styles.demo_table_body_data}>
                  </td>
                  <td className={styles.demo_table_body_data}>
                  </td>
              </tr>
              <tr className={styles.demo_table_body_row}>
                  <td className={styles.demo_table_body_data}>
                  </td>
                  <td className={styles.demo_table_body_data}>
                  </td>
              </tr>
          </tbody>
        </table>    
      )}
    </div>
  )
}

export default ProductHeroTable
