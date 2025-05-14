import { useEffect, useState } from "react";


export default function useFetch<T>(url: string): {
    data: T | null,
    error: string | null,
    loading: boolean
} {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!url) return

        console.log("useEffect", url);
        setLoading(true)

        fetch(url)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [url])

    return { data, error, loading }
}