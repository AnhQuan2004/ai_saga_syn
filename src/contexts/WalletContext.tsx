import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { QSAGA_NETWORK, getHexChainId } from '../utils/contractUtils';

export interface NetworkConfig {
  chainId: string; // Hex string
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number; };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const NETWORKS: Record<string, NetworkConfig> = {
  saga: QSAGA_NETWORK
};

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  signer: ethers.Signer | null;
  provider: ethers.providers.Web3Provider | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkConfig: NetworkConfig) => Promise<void>;
  addNetwork: (networkConfig: NetworkConfig) => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  networkName: string;
  isCorrectNetwork: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const providerOptions = {};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('Unknown Network');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [ethereumProvider, setEthereumProvider] = useState<any>(null);

  const updateUserInfo = async (
    provider: ethers.providers.Web3Provider,
    address: string
  ) => {
    try {
      const signer = provider.getSigner();
      setSigner(signer);
      
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      
      const networkName = getNetworkNameFromChainId(network.chainId);
      setNetworkName(networkName);
      
      // Check if connected to the correct network (QSaga)
      const qsagaChainId = parseInt(QSAGA_NETWORK.chainId);
      setIsCorrectNetwork(network.chainId === qsagaChainId);
      
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Error updating user info:', err);
    }
  };

  const getNetworkNameFromChainId = (chainId: number): string => {
    // Convert to decimal for comparison
    const chainIdStr = chainId.toString();
    
    // Check known networks
    for (const [name, config] of Object.entries(NETWORKS)) {
      const networkChainId = parseInt(config.chainId);
      if (networkChainId === chainId) {
        return config.chainName;
      }
    }
    
    // Return chain ID if network name not found
    return `Chain ID: ${chainIdStr}`;
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });
      
      const instance = await web3Modal.connect();
      setEthereumProvider(instance);
      
      const provider = new ethers.providers.Web3Provider(instance);
      setProvider(provider);
      
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const address = accounts[0];
        setAddress(address);
        await updateUserInfo(provider, address);
      } else {
        throw new Error('No accounts found');
      }
      
      // Setup event listeners
      instance.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          const newAddress = accounts[0];
          setAddress(newAddress);
          if (provider) {
            await updateUserInfo(provider, newAddress);
          }
        } else {
          // User disconnected all accounts
          disconnectWallet();
        }
      });
      
      instance.on('chainChanged', async (chainIdHex: string) => {
        // Handle chain change without page reload
        const chainIdNum = parseInt(chainIdHex, 16);
        setChainId(chainIdNum);
        
        const networkName = getNetworkNameFromChainId(chainIdNum);
        setNetworkName(networkName);
        
        // Check if connected to the correct network (QSaga)
        const qsagaChainId = parseInt(QSAGA_NETWORK.chainId);
        setIsCorrectNetwork(chainIdNum === qsagaChainId);
        
        // Refresh provider and signer
        if (instance) {
          const updatedProvider = new ethers.providers.Web3Provider(instance);
          setProvider(updatedProvider);
          
          if (address) {
            await updateUserInfo(updatedProvider, address);
          }
        }
      });
      
      instance.on('disconnect', () => {
        disconnectWallet();
      });
      
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners
    if (ethereumProvider) {
      ethereumProvider.removeListener('accountsChanged', () => {});
      ethereumProvider.removeListener('chainChanged', () => {});
      ethereumProvider.removeListener('disconnect', () => {});
      setEthereumProvider(null);
    }
    
    // Clear web3modal cache
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    }
    
    // Reset state
    setAddress(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    setBalance('0');
    setNetworkName('Unknown Network');
    setIsCorrectNetwork(false);
    setError(null);
  };

  const switchNetwork = async (networkConfig: NetworkConfig) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      // Ensure chainId is in hex format with 0x prefix
      const chainIdHex = networkConfig.chainId.startsWith('0x') 
        ? networkConfig.chainId 
        : getHexChainId(networkConfig.chainId);
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      // The chainChanged event will handle updating the state
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        await addNetwork(networkConfig);
      } else {
        throw error;
      }
    }
  };

  const addNetwork = async (networkConfig: NetworkConfig) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      // Ensure chainId is in hex format with 0x prefix
      const chainIdHex = networkConfig.chainId.startsWith('0x') 
        ? networkConfig.chainId 
        : getHexChainId(networkConfig.chainId);
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: networkConfig.chainName,
          nativeCurrency: networkConfig.nativeCurrency,
          rpcUrls: networkConfig.rpcUrls,
          blockExplorerUrls: networkConfig.blockExplorerUrls,
        }],
      });
      
      // The chainChanged event will handle updating the state
    } catch (error) {
      console.error('Error adding network:', error);
      throw error;
    }
  };

  // Auto-connect if provider is cached
  useEffect(() => {
    if (typeof window !== 'undefined' && 
        localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        signer,
        provider,
        balance,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        addNetwork,
        isConnected: !!address,
        isConnecting,
        error,
        networkName,
        isCorrectNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 