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

    const [pathProjects, setPathProjects] = useState([]);
    const [dataProjects, setDataProjects] = useState([]);

    const [pathSource, setPathSource] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    const [pathFunction, setPathFunction] = useState([]);
    const [dataFunction, setDataFunction] = useState([]);

    useEffect(() => {
        if (path) {
            addToPath(path, setPathProjects,"ctl00_CPH1_BtnProdProy");
            addToPath(path, setPathSource,"ctl00_CPH1_BtnRubro");
            addToPath(path, setPathFunction,"ctl00_CPH1_BtnFuncion");
        }
    }, [path]);

    useEffect(() => {
        setIsLoading(true);
        getRemiPath(pathProjects, setDataProjects);
    }, [pathProjects]);
    useEffect(() => {
        setIsLoading(true);
        getRemiPath(pathSource, setDataSource);
    }, [pathSource]);
    useEffect(() => {
        setIsLoading(true);
        getRemiPath(pathFunction, setDataFunction);
    }, [pathFunction]);


    useEffect(() => {
        if(dataProjects && dataSource){
            setIsLoading(false);
        }
    }, [dataProjects,dataSource,dataFunction]);

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
                        <ExecutionSummaryReportComponent data={dataProjects}></ExecutionSummaryReportComponent>

                        <ExecutionPiaPimReportComponent data={dataProjects}></ExecutionPiaPimReportComponent>
                        
                        <h3>Ingresos para inversiones:</h3> 
                        <ResultsComponent data={dataSource} action={null} path={path} select={null} enabledProy={false} buttonsVisible={false} label="Rubro"></ResultsComponent>

                        <h3>Composición del avance de la ejecución presupuestal de inversiones:</h3> 
                        <ResultsComponent data={dataFunction} action={null} path={path} select={null} enabledProy={false} buttonsVisible={false} label="Función"></ResultsComponent>
                         
                        <ResultsComponent data={dataProjects} action={null} path={path} select={null} enabledProy={false} buttonsVisible={false} label="Proyecto"></ResultsComponent>
                    </>



                }
            </>
        </>
    );
} 
export default ReportComponent;

function addToPath(path, setPathProjects,btnId) {
    let _pathProjects = path.slice();
    _pathProjects.push(btnId);
    setPathProjects(_pathProjects);
}
