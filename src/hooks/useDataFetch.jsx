import { useEffect, useState } from 'react';

export const useDataFetch = (url, params) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url, params);
        const jsonData = await response.json();
        setData(jsonData);
      } catch(error) {
        setError(error);
      }

      setIsLoading(false);
    }

    fetchData();
  }, url, params);

  return { data, isLoading, error };
}
