import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletProvider } from './contexts/WalletContext.tsx';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { qsagaChain } from './utils/contractUtils.ts';
import { injected } from 'wagmi/connectors';

// Configure wagmi
const config = createConfig({
  chains: [qsagaChain],
  transports: {
    [qsagaChain.id]: http(qsagaChain.rpcUrls.default.http[0]),
  },
  connectors: [injected()],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <WagmiProvider config={config}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </WagmiProvider>
);
