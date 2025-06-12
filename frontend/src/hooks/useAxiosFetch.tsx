import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { AxiosError } from "axios";

export default function useAxiosFetc<T>(url: string) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<T>(url);
                if (isMounted) {
                    setData(response.data);
                }
            } catch (err) {
                const axiosError = err as AxiosError;
                if (isMounted) {
                    setError(axiosError?.response?.data?.Detail || axiosError.message || "Error desconocido");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false;
        };
    }, [url])

    return { data, loading, error }
}