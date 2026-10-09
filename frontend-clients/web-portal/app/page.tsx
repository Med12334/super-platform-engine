"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchTelemetry = () => {
    fetch("http://127.0.0.1:8000/api/v1/logistics/status")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async () => {
    setIsDispatching(true);
    await fetch("http://127.0.0.1:8000/api/v1/logistics/dispatch", { method: "POST" });
    fetchTelemetry(); 
    setTimeout(() => setIsDispatching(false), 300); 
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🌍 Super-Platform Control Center</h1>
      
      {data ? (
        <div className="bg-slate-900 p-8 rounded-xl shadow-2xl border border-slate-800 w-full max-w-md">
          
          {/* RADAR MAP INTERFACE */}
          <div className="relative w-full h-48 bg-slate-950 rounded-xl mb-6 border border-slate-700 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30"></div>
            {/* Circles */}
            <div className="absolute w-32 h-32 border border-emerald-500/40 rounded-full"></div>
            <div className="absolute w-16 h-16 border border-emerald-500/40 rounded-full"></div>
            {/* Scanning Sweep */}
            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite] origin-center opacity-50">
              <div className="w-1/2 h-1/2 bg-gradient-to-tr from-transparent to-emerald-500/40 border-r-2 border-emerald-500"></div>
            </div>
            {/* Active Driver Blips */}
            <div className="absolute top-10 left-12 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-12 right-16 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-75"></div>
            <div className="absolute top-20 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-150"></div>
            <p className="absolute bottom-2 left-2 text-[10px] text-emerald-500 font-mono tracking-widest">📡 LIVE GEO-TRACKING: {data.active_drivers} DRIVERS</p>
          </div>

          <h2 className="text-xl mb-4 font-semibold border-b border-slate-700 pb-2">Logistics Telemetry</h2>
          
          <div className="space-y-3 text-lg mb-6">
            <p className="flex justify-between">
              <span>🚚 Active Drivers:</span> 
              <span className="font-mono text-emerald-400">{data.active_drivers}</span>
            </p>
            <p className="flex justify-between">
              <span>📦 Pending Deliveries:</span> 
              <span className="font-mono text-amber-400">{data.pending_deliveries}</span>
            </p>
            <p className="flex justify-between">
              <span>⚙️ System Load:</span> 
              <span className={`font-mono font-bold uppercase ${data.system_load === 'HEAVY' ? 'text-red-400' : 'text-purple-400'}`}>
                {data.system_load}
              </span>
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700">
            <p className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">🧠 AI Routing Efficiency</span>
              <span className="font-mono font-bold text-blue-400">{data.routing_efficiency}%</span>
            </p>
            <div className="w-full bg-slate-900 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${data.routing_efficiency}%` }}></div>
            </div>
          </div>
          
          <button 
            onClick={handleDispatch}
            disabled={isDispatching || data.pending_deliveries === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDispatching ? "Assigning Route..." : "⚡ Dispatch Driver"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Establishing secure link...</p>
        </div>
      )}
    </main>
  );
}
