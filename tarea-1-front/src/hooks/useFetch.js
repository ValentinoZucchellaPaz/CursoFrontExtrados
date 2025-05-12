import { useEffect, useState } from "react";

export default function useFetch(url) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
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