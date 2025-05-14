import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { AxiosRequestConfig } from 'axios';



export default function useAxios<T>(config: AxiosRequestConfig, options = { manual: false }): {
    data: T | null,
    error: string | null,
    loading: boolean,
    refetch: (overrideConfig?: {}) => Promise<void>
} {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
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
        } catch (err: any) {
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
