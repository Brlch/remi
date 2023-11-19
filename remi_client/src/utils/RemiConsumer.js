import { API_BASE_URL } from '../config/constants';

// Get information from REMI server
export function getRemiPath(path, scope, year, setterFunction, setLoading) {
  path = path ?? [];
  if (setLoading)
    setLoading(true);
  fetch(`${API_BASE_URL}?path=${path.join('/')}&scope=${scope}&year=${year}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.rows) {
        data.rows = convertPropsToNumbers(data.rows);
        data.rows = data.rows.filter(x=>x.id);
      }
      if (setLoading)
        setLoading(false);
      setterFunction(data)
    })
    .catch(error => console.error(error));
}

// Function to update the query tree on the server
export function updateQueryTree(path,scope, year) {
  fetch(`${API_BASE_URL}/update?path=${path.join('/')}&scope=${scope}&year=${year}`);
}

// Function to update the query tree on the server and return progress
export function peekProgress(path, scope, year) {
  return fetch(`${API_BASE_URL}/peek?path=${path.join('/')}&scope=${scope}&year=${year}`)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => data)
    .catch(error => {
      console.error('Error in peekProgress:', error);
      throw error;
    });
}

// Function to get CSV data from the server
export function getCSV(path, scope, year) {
  return new Promise((resolve, reject) => {
    fetch(`${API_BASE_URL}/csv?path=${encodeURIComponent(path.join('/'))}&scope=${encodeURIComponent(scope)}&year=${year}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        if (blob.size > 0) {
          resolve(blob);
        } else {
          throw new Error('CSV could not be generated');
        }
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
}

// Function to get information about existing queries from the server
export function getExistingQueriesInfo() {
  return fetch(`${API_BASE_URL}/existing-queries`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response);
      return response.json();
    })
    .then(data => data)
    .catch(error => {
      console.error('Error fetching existing queries info:', error);
      throw error;
    });
}

function convertPropsToNumbers(arr) {
  return arr.map((obj) => {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.replace(/,/g, '').match(/^[+-]?\d+(?:\.\d+)?$/)) {
        newObj[key] = parseFloat(value.replace(/,/g, ''));
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  });
}

export function toFormat(number){
  if(number && number.toLocaleString)
    return number.toLocaleString();
  return number;
}