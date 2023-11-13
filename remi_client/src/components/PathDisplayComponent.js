import React from 'react';

const PathDisplayComponent = ({ path, onPathChange }) => {
  if (!path || path.length === 0) {
    return <div>No path selected.</div>;
  }

  // Function to extract the display name from the id
  const extractNameFromId = (id) => {
    const matches = id.match(/Btn(\w+)$/);
    return matches ? matches[1] : id;
  };

  // Function to handle step selection
  const handleStepSelection = (index) => {
    // Call the onPathChange prop with the new path up to the selected index
    onPathChange(path.slice(0, index + 1));
  };

  return (
    <div>
      <h3>Current Path:</h3>
      <ul>
        {path.map((pathItem, index) => {
          const displayName = extractNameFromId(pathItem);
          return (
            <li key={index}>
              <button onClick={() => handleStepSelection(index)}>Go to Step</button>
              {displayName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PathDisplayComponent;
