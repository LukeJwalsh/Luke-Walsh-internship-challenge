export interface CryptoStats {
  id: string;
  symbol: string;
  name: string;
  price_usd: number;
  percent_change_24h: number;
  volume_24h_usd: number;
  history: [number, number][]
}