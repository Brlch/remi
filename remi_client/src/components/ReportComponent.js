import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';
import ExecutionSummaryReportComponent from './Reports/ExecutionSummaryReportComponent';

function ReportComponent() {

    const location = useLocation();
    const { path } = location.state || [];


    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [entityData, setEntityData] = useState(null)

    useEffect(() => {
        if (path)
            getRemiPath(path, setData,setIsLoading);
    }, [path]);
    useEffect(() => {
        if (data && data.rows)
            setEntityData(data.rows.filter(x => x.name === path.at(-1)));
    }, [data, path]);
    useEffect(() => {
        if (entityData)
            setIsLoading(false);
    }, [entityData]);

    return (
        <>
            <>{isLoading && <div>Cargando...</div>}</>
            <>
                {!isLoading &&
                    <div>
                        <br></br>
                        Reporte para {path.at(-1)}
                        <br></br>
                        <ExecutionSummaryReportComponent data={entityData}></ExecutionSummaryReportComponent>
                    </div>


                }
            </>
        </>
    );
}
export default ReportComponent;