import { useState } from "react";
import { CryptoStats } from "../types/types";

export function useCrypto() {
  const [data, setData] = useState<CryptoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrypto = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/crypto?query=${query}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Crypto not found");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchCrypto };
}
