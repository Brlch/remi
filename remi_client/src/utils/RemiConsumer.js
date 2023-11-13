import { API_BASE_URL } from '../config/constants';

// Get information from REMI server
export function getRemiPath(path, scope, setterFunction, setLoading) {
  path = path ?? [];
  if (setLoading)
    setLoading(true);
  fetch(`${API_BASE_URL}?path=${path.join('/')}&scope=${scope}`)
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
export function updateQueryTree(path,scope) {
  fetch(`${API_BASE_URL}/update?path=${path.join('/')}&scope=${scope}`);
}

// Function to get CSV data from the server
export function getCSV(path, scope) {
  return new Promise((resolve, reject) => {
    fetch(`${API_BASE_URL}/csv?path=${encodeURIComponent(path.join('/'))}&scope=${encodeURIComponent(scope)}`)
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