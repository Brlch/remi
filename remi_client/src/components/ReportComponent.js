import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';
import ExecutionPiaPimReportComponent from './Reports/ExecutionPiaPimReportComponent';
import ExecutionSummaryReportComponent from './Reports/ExecutionSummaryReportComponent';
import ResultsComponent from './ResultsComponent';


function ReportComponent() {

    const location = useLocation();
    const { path } = location.state || [];


    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (path)
            getRemiPath(path, setData, setIsLoading);
    }, [path]);

    return (
        <>
            <>{isLoading && <div>Cargando...</div>}</>
            <>
                {!isLoading &&
                    <>
                        <div>
                            <br></br>
                            Reporte para {path.at(-2)}
                            <br></br>
                        </div>
                        <ExecutionSummaryReportComponent data={data}></ExecutionSummaryReportComponent>

                        <ExecutionPiaPimReportComponent data={data}></ExecutionPiaPimReportComponent>

                        <ResultsComponent data={data} action={null} path={path} select={null} enabledProy={false} buttonsVisible={false}></ResultsComponent>
                    </>



                }
            </>
        </>
    );
}
export default ReportComponent;