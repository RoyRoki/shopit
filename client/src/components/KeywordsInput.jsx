import React, { useState, useEffect } from 'react'

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
    <div className='m-5 p-4 min-h-[120px] border-black border-solid border-2 rounded-lg bg-green-400'>
      <h2>Keywords: </h2>
      <div>

            {isMax < 9 && 
                  <div>
                        <input 
                              type="text" 
                              placeholder='new keyword' 
                              value={input} onChange={(e) => handleInputChange(e)} 
                        />
                        <button onClick={(e) => handleAddKeyword(e)}>Add</button>
                  </div>
            }
            <div>
                  <ul className='grid grid-cols-3 gap-2 max-h-[100px] overflow-scroll '>
                        {keywords.map((keyword, index) => (
                              <li className='pr-2' key={index}>
                                    {keyword}{" "}
                                    <button className='text-red-500 hover:underline' onClick={(e) => handleRemoveKeyword(keyword, e)}>{"[X]"}</button>
                              </li>
                        ))}
                  </ul>
            </div>
      </div>
    </div>
  );
}

export default KeywordsInput
