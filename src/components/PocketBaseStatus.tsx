import { useEffect, useState } from 'react';
import { pb } from '../lib/pb';

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
    <div className="flex items-center gap-2 justify-center opacity-70">
      <div className={`w-2 h-2 rounded-full ${isConnected === null ? 'bg-yellow-400' : isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
        {isConnected === null ? 'Checking...' : isConnected ? 'Connected Successfully!' : 'Connection Failed'}
      </span>
    </div>
  );
}
