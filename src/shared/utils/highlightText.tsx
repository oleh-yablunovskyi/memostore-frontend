import React from 'react';

export const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();
  const startIndex = lowerText.indexOf(lowerHighlight);

  if (startIndex === -1) {
    return text;
  }

  const beforeMatch = text.slice(0, startIndex);
  const match = text.slice(startIndex, startIndex + highlight.length);
  const afterMatch = text.slice(startIndex + highlight.length);

  return (
    <>
      {beforeMatch}
      <span style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
        {match}
      </span>
      {afterMatch}
    </>
  );
};
