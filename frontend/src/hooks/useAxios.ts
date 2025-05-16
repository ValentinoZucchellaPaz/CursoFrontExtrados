import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { request } from '../services/request';



export default function useAxios<T>(config: AxiosRequestConfig, options = { manual: false }): {
    data: T | null,
    error: AxiosError | null,
    loading: boolean,
    refetch: (overrideConfig?: {}) => Promise<void>
} {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (overrideConfig = {}) => {
        setLoading(true);
        try {
            const response = await request<T>({ ...config, ...overrideConfig });
            setData(response);
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
