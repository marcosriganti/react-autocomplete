import {useState, useEffect, useCallback} from 'react';

function useQuery<T>(url: string, key: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [data, setData] = useState<T>();
    const query = url + key;
    const run = useCallback(() => {
        setLoading(true);
        fetch(query).then((response) => {
            return response.json();
        }).then(data => {
            setLoading(false);
            setData(data);
            localStorage.setItem(key, JSON.stringify(data));
        }).catch(error => {
            setError(error);
        });

    }, [query, key]);
    useEffect(() => {
        if (key.length > 3) {
            // Adding the cache to avoid  multiple queries
            if (localStorage[key]) {
                setData(JSON.parse(localStorage[key]));
            } else {
                run();
            }
        }
    }, [key, run]);
    return {
        loading,
        data,
        error
    };
};



export default useQuery;