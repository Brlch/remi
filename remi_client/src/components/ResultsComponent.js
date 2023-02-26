import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import '../styles/css/styles.css'; // Import the CSS file

function ResultsComponent({ data, action, path, select }) {
  const [tableRows, setTableRows] = useState([]);
  const [tableButtons, setTableButtons] = useState([]);
  const [choosingRow, setChoosingRow] = useState(true);
  useEffect(() => {
    if (!data)
      return;
    if (data.rows)
      setTableRows(data.rows);
    if (data.buttons)
      setTableButtons(data.buttons);
  }, [data]);
  useEffect(() => {
    setChoosingRow(path.length % 2 === 0);
  }, [path]);


  return !data ? <></> : (
    <>
      <ResultsButtonsComponent
        data={tableButtons}
        action={action}
        enabled={!choosingRow}
      />
      <ResultsTableComponent
        data={tableRows}
        action={action}
        enabled={choosingRow}
        select={select}
      />
    </>
  );
}

function ResultsTableComponent({ data, action, enabled, select }) {
  console.log("TABLE", data);
  return !data ? <></> : (
    <div>
      <table className='table table-hover table-stripped'>
        <thead>
          <tr>
            <th>Opción</th>
            <th>PIA</th>
            <th>PIM</th>
            <th>Certificación</th>
            <th>Compromiso</th>
            <th>Atencion</th>
            <th>Devengado</th>
            <th>Girado</th>
            <th>Avance</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.name} onClick={() => action(item.name)} disabled={!enabled} className={enabled ? "table-row-enabled" : "table-row-disabled"}>
              <td>{item.name}</td>
              <td>{item.pia}</td>
              <td>{item.pim}</td>
              <td>{item.cert}</td>
              <td>{item.comp}</td>
              <td>{item.atco}</td>
              <td>{item.devn}</td>
              <td>{item.gira}</td>
              <td>{item.avan}</td>
              <td> {enabled && <Button onClick={() => { select(item.name) }}>Reporte</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

function ResultsButtonsComponent({ data, action, enabled }) {

  return !data ? <></> : (
    <div className="d-flex justify-content-between">
      {data.map(item => (
        <Button key={item.id} onClick={() => action(item.id)} disabled={!enabled}>{item.text}</Button>
      ))}
    </div>
  );
}
export default ResultsComponent;