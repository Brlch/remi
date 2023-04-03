import React from 'react';
import '../../styles/css/styles.css';

function ExecutionPiaPimReportComponent({ data }) {

    if (!data || data.length === 0) return null;

    const allItemSummary = {
        pim: data.rows.reduce((a, b) => a + (b.pim > 0 ? 1 : 0), 0),
        pia: data.rows.reduce((a, b) => a + (b.pia > 0 ? 1 : 0), 0),
        devn: data.rows.reduce((a, b) => a + (b.devn > 0 ? 1 : 0), 0),
        concluded: data.rows.reduce((a, b) => a + (b.avan === 100 ? 1 : 0), 0)
    };

    return (
        <>
            <table className='table table-hover table-stripped'>
                <thead>
                    <tr>
                        <th colSpan="2">Avance de ejecución presupuestal de inversiones programadas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Inversiones programadas en el PIA</td>
                        <td>{allItemSummary.pia}</td>
                    </tr>
                    <tr>
                        <td>Inversiones programadas en el PIM</td>
                        <td>{allItemSummary.pim}</td>
                    </tr>
                    <tr>
                        <td>Inversiones iniciadas presupuestalmente</td>
                        <td>{allItemSummary.devn}</td>
                    </tr>
                    <tr>
                        <td>Con ejecución presupuestal	</td>
                        <td>{allItemSummary.devn-allItemSummary.concluded}</td>
                    </tr>
                    <tr>
                        <td>Concluidos presupuestalmente</td>
                        <td>{allItemSummary.concluded}</td>
                    </tr>
                    <tr>
                        <td>Inversiones programadas en el PIA</td>
                        <td>{allItemSummary.pim-allItemSummary.devn}</td>
                    </tr>
                </tbody>
            </table>


        </>
    );
}

export default ExecutionPiaPimReportComponent;