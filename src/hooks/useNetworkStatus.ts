import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus(): {
  isOffline: boolean;
  isConnected: boolean;
} {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      try {
        const status = await Network.getNetworkStateAsync();
        if (isMounted) {
          setIsConnected(Boolean(status.isConnected && status.isInternetReachable !== false));
        }
      } catch {
        // Fallback to true if network check is not supported
        if (isMounted) setIsConnected(true);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    isOffline: !isConnected,
    isConnected,
  };
}
