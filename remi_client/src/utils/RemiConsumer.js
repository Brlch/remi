import { API_BASE_URL } from '../config/constants';

// Get information from REMI server
export function getRemiPath(path, setterFunction) {
    path = path ?? [];
    fetch(`${API_BASE_URL}?path=${path.join('/')}`)
        .then(response => response.json())
        .then(data => {
            console.log("DATA BEFORE:",data);
            if (data && data.rows) {
                data.rows = convertPropsToNumbers(data.rows);
                console.log("Converted:",convertPropsToNumbers(data.rows));
            }
            console.log("DATA AFTER:",data);

            setterFunction(data)
        })
        .catch(error => console.error(error));
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