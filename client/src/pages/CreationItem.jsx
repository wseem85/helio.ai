import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
const CreationItem = ({ item }) => {
  console.log(item);
  const [expanded, setExpanded] = useState(false);
  const specifyBgColors = (type) => {
    if (type.toLowerCase().includes('article')) {
      return { start: '#cc2b5e', end: '#753a88' };
    }
    if (type.toLowerCase().includes('simplified')) {
      return { start: '#2193b0', end: '#6dd5ed' };
    }
    if (type.toLowerCase().includes('image')) {
      return { start: '#20C363', end: '#099c69' };
    }
    if (type.toLowerCase().includes('background')) {
      return { start: '#de6262', end: '#ffb88c' };
    }
    if (type.toLowerCase().includes('content')) {
      return { start: '#ff512f', end: '#dd2476' };
    }
    if (type.toLowerCase().includes('resume')) {
      return { start: '#614385', end: '#516395' };
    }
    return { start: 'white/20', end: 'whit/40' };
  };
  const bg = specifyBgColors(item.type);
  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className="p-4 max-w-5xl text-sm bg-black-light shadow-sm shadow-whit/60 rounded-lg cursor-pointer "
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p>{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button
          className={`border text-sm border-white bg-gradient-to-r from-[${bg.start}] to-[${bg.end}] min-w-[100px] text-white px-4 py-1 rounded-xl`}
        >
          {item.type}
        </button>
      </div>
      {expanded && (
        <div>
          {item.type === 'image' ? (
            <div>
              {' '}
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md"
              />
            </div>
          ) : (
            <div className="mt-3 max-h-[200px]  text-sm h-full overflow-y-scroll">
              <div className="reset-tw">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
