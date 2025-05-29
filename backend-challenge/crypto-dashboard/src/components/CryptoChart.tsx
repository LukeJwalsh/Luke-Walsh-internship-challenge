import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

interface Props {
  history: [number, number][]; 
  name: string;                
  symbol: string;              
  currentPrice: number;        
  days: number;                
}

export default function CryptoChart({ history, name, symbol, currentPrice, days }: Props) {
  // x-axis labels based on the selected time range (hours for 1 day, days for rest )
  const labels = history.map(([timestamp]) => {
    const date = new Date(timestamp);
    return days === 1
      ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) 
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });   
  });

  // Extract the prices from the history data
  const prices = history.map(([, price]) => price);

  // Define the data for the chart
  const data = {
    labels,
    datasets: [
      {
        label: "Price (USD)",
        data: prices,
        borderColor: "#facc15", 
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(250, 204, 21, 0.3)");
          gradient.addColorStop(1, "rgba(250, 204, 21, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,      
        pointRadius: 0,    
      },
    ],
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, 
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#1f2937", 
        titleColor: "#facc15",      
        bodyColor: "#e5e7eb",       
        padding: 10,
        borderColor: "#facc15",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",  
          maxRotation: 60,
          minRotation: 45,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",

          // Format y-axis, dollar values
          callback: function (tickValue: string | number): string {
            const value = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return `$${value.toFixed(2)}`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  };

  // Render the crypto name, current price, and chart
  return (
    <div className="chart-container bg-gray-900 text-gray-100 rounded-xl p-6 shadow-lg w-full">
      <h2 className="text-lg font-medium mb-1 text-gray-400">
        {name}/{symbol.toUpperCase()}
      </h2>
      <p className="text-3xl font-bold text-yellow-400 mb-4">
        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
      <div className="w-full h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
