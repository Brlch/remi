import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // assuming you're using react-router for navigation
import { getExistingQueriesInfo } from '../utils/RemiConsumer';
import styles from './ExistingQueriesList.module.css'; // Import CSS module

const ExistingQueriesList = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook from react-router

  useEffect(() => {
    setLoading(true);
    getExistingQueriesInfo()
      .then(data => {
        const cleanedData = data.map(query => ({
          ...query,
          cleanName: query.originalRootName.replace(/ctl00_CPH1_Btn/g, ''),
          pathArray: query.originalRootName.split('/') // slice to remove the leading empty element from absolute path split
        }));
        setQueries(cleanedData);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleNavigate = (pathArray, scope, year) => {
    // Assuming the SelectEntityComponent is reachable via '/select-entity' route
    navigate('/', { state: { path: pathArray, scope: scope, year: year } });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.existingQueries}>
      <h2>Existing Queries</h2>
      <ul>
        {queries.map((query, index) => (
          <li key={index} className={styles.queryItem}>
            <span className={styles.queryName}>
              {query.cleanName?.split('/').join(' > ')}
            </span>
            <span className={styles.queryUpdated}>
              Last Updated: {new Date(query.lastUpdateTime).toLocaleString()}
            </span>
            <button className={styles.navigateButton} onClick={() => handleNavigate(query.pathArray,query.scope,query.year)}>
              Navigate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExistingQueriesList;
