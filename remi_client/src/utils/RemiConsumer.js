import { API_BASE_URL } from '../config/constants';

// Get information from REMI server
export function getRemiPath(path, setterFunction, setLoading) {
  path = path ?? [];
  if (setLoading)
    setLoading(true);
  fetch(`${API_BASE_URL}?path=${path.join('/')}`)
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