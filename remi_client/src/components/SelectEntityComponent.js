import React, { useState, useEffect } from 'react';
import ResultsComponent from './ResultsComponent';
import { useNavigate } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';

function SelectEntityComponent() {

  const navigate = useNavigate();

  // Declare a new state variable, which we'll call "count"
  const [path, setPath] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getRemiPath(path,setData);
  }, [path]);

  const addToPath = (addedPath) => {
    setPath([...path, addedPath]);
  };

  const selectEntity = (entityPath) => {
    navigate('/report', { state: { path: [...path, entityPath] } });
  };

  useEffect(() => {
    console.log("Latest data", data);
  }, [data]);

  return (
    <>
      {data && <ResultsComponent data={data} action={addToPath} path={path} select={selectEntity}></ResultsComponent>}
    </>
  );
}
export default SelectEntityComponent;