'use client';

import { createContext, useContext, useCallback, useState, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
declare global {
  interface Window {
      ethereum: any;
  }
}
export interface WalletContextValue {
  connected: boolean;
  account?: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

interface WalletProviderProps {}

export const WalletContext = createContext<WalletContextValue>({
  connected: false,
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
});

export const WalletProvider = ({ children }: PropsWithChildren<WalletProviderProps>) => {
  const router = useRouter();
  const [state, setState] = useState<Omit<WalletContextValue, 'connect' | 'disconnect'>>({
    connected: false,
  });

  const getAccount = async () => {
    const accounts = await window.ethereum.request({ 
      method: 'wallet_requestPermissions', 
      params: [{
        eth_accounts: {},
      }]
    });
    
    const account = accounts[0];

    return account;
  }

  const connect = useCallback(async () => {
    if (state.connected) {
      Promise.resolve();
      return;
    }

    new Promise<void>(async (resolve, reject) => {

      if (typeof window.ethereum === 'undefined') {
        reject(new Error('MetaMask is not installed!'));
      }

      const account = await getAccount();

      if (account) {
        resolve();
        router.push('/challenges/08-connect-wallet');
        setState({ connected: true, account });
      } else {
        reject(new Error('User rejected the connection'));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.connected]);

  const disconnect = useCallback(async () => {
    if (!state.connected) {
      Promise.resolve();
      return;
    }

    setState({ connected: false });
  }, [state.connected]);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
