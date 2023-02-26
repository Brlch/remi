import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { getRemiPath } from '../utils/RemiConsumer';
import ExecutionSummaryReportComponent from './Reports/ExecutionSummaryReportComponent';

function ReportComponent() {

    const location = useLocation();
    const { path } = location.state || [];


    // Declare a new state variable, which we'll call "count"
    const [data, setData] = useState([]);
    const [entityData, setEntityData] = useState(null)

    useEffect(() => {
        if (path)
            getRemiPath(path, setData);
    }, [path]);
    useEffect(() => {
        if (data && data.rows)
            setEntityData(data.rows.filter(x => x.name === path.at(-1)));
    }, [data]);

    return (
        <>
            <div>
                <br></br>
                Reporte para {path}
                <br></br>
                <ExecutionSummaryReportComponent data={entityData}></ExecutionSummaryReportComponent>
            </div>

        </>
    );
}
export default ReportComponent;