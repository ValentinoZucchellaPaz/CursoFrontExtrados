import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export default function useAxios(config, options = { manual: false }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (overrideConfig = {}) => {
        setLoading(true);
        try {
            const response = await apiClient({
                ...config,
                ...overrideConfig
            });
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [config]);

    useEffect(() => {
        if (!options.manual) {
            fetchData();
        }
    }, [options.manual]);

    return {
        data,
        error,
        loading,
        refetch: fetchData, // para usarlo manualmente si querés
    };
}
