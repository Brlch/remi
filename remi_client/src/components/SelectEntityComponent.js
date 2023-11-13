import React, { useState, useEffect } from 'react';
import ResultsComponent from './ResultsComponent';
import { useNavigate } from 'react-router-dom';
import { getRemiPath, updateQueryTree, getCSV } from '../utils/RemiConsumer'; // Import the new functions
import PathDisplayComponent from './PathDisplayComponent';
import styles from './SelectEntity.module.css';

function SelectEntityComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [proyEnabled, setProyEnabled] = useState(false);
  const [path, setPath] = useState([]);
  const [scope, setScope] = useState("Proyecto");
  const [data, setData] = useState([]);
  const [csvTable, setCsvTable] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getRemiPath(path, scope, setData, setIsLoading);
  }, [path, scope]);

  useEffect(() => {
    if ((path.at(-1) ?? "").includes("_Btn") && (data.buttons ?? []).filter(x => x.id === "ctl00_CPH1_BtnProdProy").length)
      setProyEnabled(true);
    else
      setProyEnabled(false);
  }, [path, data]);

  const addToPath = (addedPath) => {
    setPath([...path, addedPath]);
  };

  const selectEntity = (entityPath) => {
    navigate('/report', { state: { path: [...path, entityPath] } });
  };

  const handleScopeChange = (event) => setScope(event.target.value);

  const handleUpdate = () => {
    updateQueryTree(path, scope);
  };
  const handleDownload = () => {
    getCSV(path, scope)
      .then(blob => blob.text())
      .then(csvString => {
        const { headers, data } = parseCSV(csvString);
        setCsvTable({ headers, data });
      })
      .catch(error => console.error('Error downloading CSV:', error));
  };

  const downloadCSV = () => {
    getCSV(path, scope)
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => console.error('Error downloading CSV:', error));
  };

  const parseCSV = (csvString) => {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    return { headers, data };
  }


  return (
    <div className={styles.container}>
      <div className={styles.pathDisplay}>
        <PathDisplayComponent path={path} onPathChange={setPath} />
        <div className={styles.scopeSelector}>
          {["Proyecto", "Actividad", "ActProy"].map((value) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                checked={scope === value}
                onChange={handleScopeChange}
              />
              {value}
            </label>
          ))}

          <button onClick={handleUpdate}>
            Update CSV
          </button>
          <button onClick={handleDownload}>
            Check CSV
          </button>
          <button onClick={downloadCSV}>
            Download CSV
            </button>
        </div>
      </div>
      <div className={styles.mainContent}>
        {csvTable ? (
          <table>
            <thead>
              <tr>
                {csvTable.headers.map(header => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {csvTable.data.map((row, index) => (
                <tr key={index}>
                  {csvTable.headers.map(header => <td key={header}>{row[header]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            {isLoading && <div>Cargando...</div>}
            {!isLoading && data && (
              <ResultsComponent
                data={data}
                action={addToPath}
                path={path}
                select={selectEntity}
                enabledProy={proyEnabled}
                buttonsVisible={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default SelectEntityComponent;