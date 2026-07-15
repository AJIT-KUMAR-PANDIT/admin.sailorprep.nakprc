import { useEffect, useState } from 'react';
import { pb, POCKETBASE_URL } from '../lib/pb';

export default function PocketBaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // A simple health check to verify the connection
        const health = await pb.health.check();
        setIsConnected(health.code === 200);
      } catch (error) {
        console.error("PocketBase connection error:", error);
        setIsConnected(false);
      }
    }
    checkConnection();
  }, []);

  return (
    <div className="p-4 m-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-2">PocketBase Connection Status</h3>
      <p className="text-sm mb-1 text-slate-600 dark:text-slate-300">
        URL: <span className="font-mono">{POCKETBASE_URL}</span>
      </p>
      <div className="flex items-center gap-2 mt-2">
        <div className={`w-3 h-3 rounded-full ${isConnected === null ? 'bg-yellow-400' : isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">
          {isConnected === null ? 'Checking...' : isConnected ? 'Connected Successfully!' : 'Connection Failed'}
        </span>
      </div>
      {!isConnected && isConnected !== null && (
        <p className="text-xs text-red-500 mt-2">
          Make sure your VPS is running: <code>./pocketbase serve --http=0.0.0.0:8090</code>
        </p>
      )}
    </div>
  );
}
