import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import '../styles/css/styles.css'; // Import the CSS file
import { toFormat } from '../utils/RemiConsumer';

function ResultsComponent({ data, action, path, select, enabledProy, buttonsVisible,label }) {

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
        buttonsVisible={buttonsVisible}
      />
      <ResultsTableComponent
        data={tableRows}
        action={action}
        enabled={choosingRow}
        select={select}
        enabledProy={enabledProy}
        buttonsVisible={buttonsVisible}
        label={label}

      />
    </>
  );
}

function ResultsTableComponent({ data, action, enabled, select, enabledProy, buttonsVisible,label }) {

  return !data ? <></> : (
    <div>
      <table className='table table-hover table-stripped'>
        <thead>
          <tr>
            <th>{(buttonsVisible?"Opción":label)}</th>
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
            <tr key={item.name} onClick={() => action(item.name)} disabled={(!enabled && buttonsVisible)} className={(enabled || !buttonsVisible) ? "table-row-enabled" : "table-row-disabled"}>
              <td>{item.name}</td>
              <td>{toFormat(item.pia)}</td>
              <td>{toFormat(item.pim)}</td>
              <td>{toFormat(item.cert)}</td>
              <td>{toFormat(item.comp)}</td>
              <td>{toFormat(item.atco)}</td>
              <td>{toFormat(item.devn)}</td>
              <td>{toFormat(item.gira)}</td>
              <td>{item.avan}%</td>
              <td>
                {enabledProy && <Button onClick={() => { select(item.name) }}>Reporte</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}

function ResultsButtonsComponent({ data, action, enabled, buttonsVisible }) {

  return (!data || !buttonsVisible || !enabled) ? <></> : (
    <div className="d-flex justify-content-between">
      {data.map(item => (
        <Button key={item.id} onClick={() => action(item.id)} disabled={!enabled}>{item.text}</Button>
      ))}
    </div>
  );
}
export default ResultsComponent;