import React, { useState, useEffect } from 'react';
import ResultsComponent from './ResultsComponent';
import { useNavigate } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';

function SelectEntityComponent() {

  const navigate = useNavigate();

  // Declare a new state variable, which we'll call "count"
  const [isLoading, setIsLoading] = useState(true);
  const [path, setPath] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getRemiPath(path,setData,setIsLoading);
  }, [path]);

  const addToPath = (addedPath) => {
    setPath([...path, addedPath]);
  };

  const selectEntity = (entityPath) => {
    navigate('/report', { state: { path: [...path, entityPath] } });
  };

  return (
    <>
      <>{isLoading && <div>Cargando...</div>}</>
      {(!isLoading && data) && <ResultsComponent data={data} action={addToPath} path={path} select={selectEntity}></ResultsComponent>}
    </>
  );
}
export default SelectEntityComponent;