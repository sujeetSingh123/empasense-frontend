import { jwtDecode } from 'jwt-decode';
import { getToken } from './localStorage';


export const getDecoded = (): any => {
  const idToken = getToken();
  if (!idToken) return;

  const decoded = jwtDecode(idToken);

  return decoded;
};

export const getUserName = () => {
  return getDecoded()['cognito:username'];
};











export function convertJsonToFormData(requestData: any) {
  const formData = new FormData();
  for (const data in requestData) {
    if (requestData[data] instanceof Array) {
      requestData[data].forEach((dataEl: any, index: number) => {
        if (dataEl instanceof Object && !(dataEl instanceof File)) {
          Object.keys(dataEl).forEach((elKey) => formData.append(`${data}[${index}].${elKey}`, dataEl[elKey]));
        } else if (dataEl instanceof File) {
          formData.append(`${data}[${index}]`, dataEl);
        } else if (typeof dataEl === 'number' || typeof dataEl === 'string') {
          formData.append(`${data}[${index}]`, dataEl.toString());
        }
      });
    } else if (requestData[data] instanceof Object && !(requestData[data] instanceof File)) {
      Object.entries(requestData[data]).forEach(([key, value]: [string, any]) =>
        formData.append(`${data}.${key}`, value),
      );
    } else {
      formData.append(data, requestData[data]);
    }
  }

  return formData;
}

type AnyFunction = (...args: any[]) => any;

export function debounce<F extends AnyFunction>(func: F, delay: number): (...args: Parameters<F>) => void {
  let timerId: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<F>): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}












