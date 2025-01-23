import React, { useState, useEffect } from 'react'
import styles from './KeywordsInput.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const KeywordsInput = ({ onSelect, initialSelectedKeywords }) => {
      const [keywords, setKeywords] = useState(initialSelectedKeywords || []);
      const [input, setInput] = useState("");
      const [isMax, setIsMax] = useState(0);

      const handleInputChange = (e) => {
            setInput(e.target.value);
      };

      const handleKeywordChange = () => {
            onSelect(keywords);
      };

      const handleAddKeyword = (e) => {
            e.preventDefault();

            if(input.trim() && isMax < 9) {
                  setKeywords([...keywords, input.replace(/ /g, "")]);
                  setIsMax(isMax+1);
                  setInput("");  
            }

      };

      useEffect((() => {
            handleKeywordChange();
      }), [keywords]);

      const handleRemoveKeyword = (keyToRemove, e) => {
            e.preventDefault();
            setKeywords(keywords.filter(keyword => keyword !== keyToRemove));
            setIsMax(isMax-1);
            handleKeywordChange();
            // @ToDo update the keywords using index, use splice(index, 1)
      };

  return (
    <div className={styles.box_wrap}>
      <div className={styles.keywords_box}>
            {isMax < 9 && 
                  <div className={styles.input_box}>
                        <input 
                              type="text" 
                              placeholder='new keyword' 
                              value={input} onChange={(e) => handleInputChange(e)} 
                        />
                        <button onClick={(e) => handleAddKeyword(e)}>
                              <FontAwesomeIcon icon={faPlus}/>
                        </button>
                  </div>
            }
            <div className={styles.show_keys_box}>
                  <ul>
                        {keywords.map((keyword, index) => (
                              <li key={index}>
                                    {keyword}{" "}
                                    <button onClick={(e) => handleRemoveKeyword(keyword, e)}>
                                          <FontAwesomeIcon icon={faXmark}/>
                                    </button>
                              </li>
                        ))}
                  </ul>
            </div>
      </div>
    </div>
  );
}

export default KeywordsInput
