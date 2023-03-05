import React, { useState, useEffect } from 'react';
import ResultsComponent from './ResultsComponent';
import { useNavigate } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';

function SelectEntityComponent() {

  const navigate = useNavigate();

  // Declare a new state variable, which we'll call "count"
  const [isLoading, setIsLoading] = useState(true);
  const [proyEnabled, setProyEnabled] = useState(false);
  const [path, setPath] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getRemiPath(path, setData, setIsLoading);


  }, [path]);

  useEffect(() => {
    if ((path.at(-1) ?? "").includes("_Btn") && (data.buttons ?? []).filter(x => x.id === "ctl00_CPH1_BtnProdProy").length )
      setProyEnabled(true);
    else
      setProyEnabled(false);
  }, [data]);
  const addToPath = (addedPath) => {
    setPath([...path, addedPath]);
  };

  const selectEntity = (entityPath) => {
    navigate('/report', { state: { path: [...path, entityPath,(data.buttons ?? []).filter(x => x.id === "ctl00_CPH1_BtnProdProy")[0].id] } });
  };

  return (
    <>
      <>{isLoading && <div>Cargando...</div>}</>
      {(!isLoading && data) && <ResultsComponent data={data} action={addToPath} path={path} select={selectEntity} enabledProy={proyEnabled} buttonsVisible={true}></ResultsComponent>}
    </>
  );
}
export default SelectEntityComponent;