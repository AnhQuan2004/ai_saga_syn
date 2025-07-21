import { ethers } from 'ethers';
import contractABI from '../abi.json';
import { defineChain } from 'viem';

// You should set this in your .env file
// We'll use a default value for development
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x36D65942d98b6Ed2CA01A1f85e7ca7afA1C04CE6';

// Define the QSaga network parameters
export const QSAGA_NETWORK = {
  chainId: '2752562277992000', // Decimal format
  chainName: 'QSaga',
  nativeCurrency: {
    name: 'Saga',
    symbol: 'SQA',
    decimals: 18,
  },
  rpcUrls: ['https://asga-2752562277992000-1.jsonrpc.sagarpc.io'],
  blockExplorerUrls: ['https://asga-2752562277992000-1.sagaexplorer.io'],
};

// Define the QSaga chain for wagmi/viem
export const qsagaChain = defineChain({
  id: Number(QSAGA_NETWORK.chainId),
  name: QSAGA_NETWORK.chainName,
  nativeCurrency: QSAGA_NETWORK.nativeCurrency,
  rpcUrls: {
    default: {
      http: QSAGA_NETWORK.rpcUrls,
    },
    public: {
      http: QSAGA_NETWORK.rpcUrls,
    },
  },
  blockExplorers: QSAGA_NETWORK.blockExplorerUrls?.[0] ? {
    default: {
      name: 'QSaga Explorer',
      url: QSAGA_NETWORK.blockExplorerUrls[0],
    },
  } : undefined,
});

/**
 * Get hex chain ID from decimal
 * @param decimalChainId - Chain ID in decimal format
 * @returns Hex chain ID with 0x prefix
 */
export const getHexChainId = (decimalChainId: string | number): string => {
  const chainIdNum = typeof decimalChainId === 'string' ? parseInt(decimalChainId) : decimalChainId;
  return '0x' + chainIdNum.toString(16);
};

/**
 * Ensure the wallet is connected to the correct network
 * @param signer - Ethers signer
 * @returns Promise that resolves when the network is correct
 */
export const ensureCorrectNetwork = async (signer: ethers.Signer): Promise<void> => {
  try {
    const chainId = await signer.getChainId();
    const expectedChainId = parseInt(QSAGA_NETWORK.chainId);
    
    if (chainId !== expectedChainId) {
      // Try to switch to the QSaga network
      try {
        await (window.ethereum as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: getHexChainId(QSAGA_NETWORK.chainId) }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          const networkConfig = {
            ...QSAGA_NETWORK,
            chainId: getHexChainId(QSAGA_NETWORK.chainId)
          };
          
          await (window.ethereum as any).request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
        } else {
          throw switchError;
        }
      }
    }
  } catch (error) {
    console.error('Failed to ensure correct network:', error);
    throw new Error('Please connect to the QSaga network to continue');
  }
};

/**
 * Get a provider for the current network
 * @returns Provider instance
 */
export const getProvider = (): ethers.providers.Web3Provider => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  // Create a provider without specifying network options
  return new ethers.providers.Web3Provider(window.ethereum);
};

/**
 * Create a contract instance with a signer
 * @param signer - Ethers signer
 * @returns Contract instance
 */
export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
};

/**
 * Create a read-only contract instance with a provider
 * @param provider - ethers.providers.Provider
 * @returns Read-only contract instance
 */
export const getReadOnlyContract = (provider: ethers.providers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
};

/**
 * Format bytes32 string
 * @param hash - Hash string
 * @returns Formatted bytes32 string
 */
export const formatBytes32 = (hash: string): string => {
  let contentHashBytes32 = hash;
  if (!contentHashBytes32.startsWith('0x')) {
    contentHashBytes32 = '0x' + contentHashBytes32;
  }
  
  // Pad to 32 bytes if needed
  while (contentHashBytes32.length < 66) { // 0x + 64 chars
    contentHashBytes32 += '0';
  }
  
  return contentHashBytes32;
};

/**
 * Send a transaction using window.ethereum
 * @param from - Sender address
 * @param to - Contract address
 * @param data - Encoded function data
 * @returns Transaction hash
 */
export const sendTransaction = async (
  from: string,
  to: string,
  data: string
): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    // Get current chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current chain ID:", chainId);
    
    // Send transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from,
        to,
        data
      }]
    });
    
    return txHash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

/**
 * Extract token ID from transaction logs
 * @param receipt - Transaction receipt
 * @param contractInterface - Contract interface
 * @returns Token ID or null
 */
export const extractTokenIdFromLogs = (
  receipt: any,
  contractInterface: ethers.utils.Interface
): string | null => {
  try {
    // Find the MetadataMinted event in the logs
    for (const log of receipt.logs) {
      try {
        // Convert log format if needed
        const ethersLog = {
          ...log,
          topics: log.topics || [],
          data: log.data || '0x'
        };
        
        const parsedLog = contractInterface.parseLog(ethersLog);
        if (parsedLog.name === 'MetadataMinted' && parsedLog.args.tokenId) {
          return parsedLog.args.tokenId.toString();
        }
      } catch (e) {
        // Skip logs that can't be parsed
        continue;
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting token ID from logs:', error);
    return null;
  }
};

// Contract Function Utilities

/**
 * Mint a metadata NFT
 * @param signer - Ethers signer
 * @param metadata - Metadata for the NFT
 * @returns Transaction receipt
 */
export const mintMetadataNFT = async (
  signer: ethers.Signer,
  metadata: {
    sourceUrl: string;
    contentHash: string;
    contentLink: string;
    embedVectorId: string;
    createdAt: string | number;
    tags: string[];
    tokenURI: string;
  }
) => {
  // First ensure we're on the correct network
  await ensureCorrectNetwork(signer);
  
  // Format content hash as bytes32
  const contentHashBytes32 = formatBytes32(metadata.contentHash);
  
  // Filter out empty tags
  const filteredTags = metadata.tags.filter(tag => tag.trim() !== '');
  
  // Convert createdAt to number if it's a string
  const createdAt = typeof metadata.createdAt === 'string' 
    ? parseInt(metadata.createdAt) 
    : metadata.createdAt;
  
  try {
    console.log("Minting a new metadata NFT...");

    // Get contract instance
    const contract = getContract(signer);
    
    // Get sender address
    const from = await signer.getAddress();
    
    // Encode function data
    const data = contract.interface.encodeFunctionData('mintMetadataNFT', [
      metadata.sourceUrl,
      contentHashBytes32,
      metadata.contentLink,
      metadata.embedVectorId,
      createdAt,
      filteredTags,
      metadata.tokenURI
    ]);
    
    // Send transaction using window.ethereum directly
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Transaction sent:", txHash);
    
    // Wait for transaction to be mined
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    console.log("Transaction mined:", receipt);
    
    // Extract token ID from logs
    const tokenId = extractTokenIdFromLogs(receipt, contract.interface);
    
    return {
      receipt,
      txHash,
      tokenId
    };
  } catch (error) {
    console.error('Error in mintMetadataNFT:', error);
    throw error;
  }
};

/**
 * Get metadata for a token
 * @param provider - Ethers provider
 * @param tokenId - Token ID
 * @returns Metadata
 */
export const getMetadata = async (provider: ethers.providers.Provider, tokenId: string | number) => {
  const contract = getReadOnlyContract(provider);
  return contract.getMetadata(tokenId);
};

/**
 * Create a bounty
 * @param signer - Ethers signer
 * @param amount - Amount to stake in wei
 * @returns Bounty ID
 */
export const createBounty = async (signer: ethers.Signer, amount: ethers.BigNumber) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('createBounty', []);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Create bounty transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    // Extract bounty ID from logs
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === 'BountyCreated' && parsedLog.args.id) {
          return {
            receipt,
            txHash,
            bountyId: parsedLog.args.id.toString()
          };
        }
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('Could not find bounty ID in transaction logs');
  } catch (error) {
    console.error('Error creating bounty:', error);
    throw error;
  }
};

/**
 * Add a contributor to a bounty
 * @param signer - Ethers signer
 * @param bountyId - Bounty ID
 * @param contributor - Contributor address
 * @returns Transaction receipt
 */
export const addContributor = async (
  signer: ethers.Signer,
  bountyId: string | number,
  contributor: string
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('addContributor', [bountyId, contributor]);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Add contributor transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error adding contributor:', error);
    throw error;
  }
};

/**
 * Distribute a bounty
 * @param signer - Ethers signer
 * @param bountyId - Bounty ID
 * @returns Transaction receipt
 */
export const distributeBounty = async (signer: ethers.Signer, bountyId: string | number) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('distributeBounty', [bountyId]);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Distribute bounty transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error distributing bounty:', error);
    throw error;
  }
};

/**
 * Donate to a creator
 * @param signer - Ethers signer
 * @param metadataId - Metadata ID
 * @param amount - Amount to donate in wei
 * @returns Transaction receipt
 */
export const donateToCreator = async (
  signer: ethers.Signer,
  metadataId: string | number,
  amount: ethers.BigNumber
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    // Encode the function data
    const data = contract.interface.encodeFunctionData('donateToCreator', [metadataId]);
    
    // Convert amount to hex string for MetaMask
    const valueHex = ethers.utils.hexValue(amount);
    
    console.log("Donating to creator of metadata ID:", metadataId);
    console.log("Amount:", ethers.utils.formatEther(amount), "QSG");
    console.log("Value in hex:", valueHex);
    
    // Send transaction using window.ethereum directly
    // Make sure all parameters are properly formatted to avoid MetaMask errors
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: from,
        to: CONTRACT_ADDRESS,
        data: data,
        value: valueHex
      }]
    });
    
    console.log("Donation transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    console.log("Donation transaction confirmed:", receipt);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error donating to creator:', error);
    throw error;
  }
};

/**
 * Get a bounty
 * @param provider - Ethers provider
 * @param bountyId - Bounty ID
 * @returns Bounty details
 */
export const getBounty = async (provider: ethers.providers.Provider, bountyId: string | number) => {
  const contract = getReadOnlyContract(provider);
  return contract.getBounty(bountyId);
};

/**
 * Get metadata by creator
 * @param provider - Ethers provider
 * @param creator - Creator address
 * @returns Array of metadata IDs
 */
export const getMetadataByCreator = async (provider: ethers.providers.Provider, creator: string) => {
  const contract = getReadOnlyContract(provider);
  return contract.getMetadataByCreator(creator);
};

/**
 * Get next bounty ID
 * @param provider - Ethers provider
 * @returns Next bounty ID
 */
export const getNextBountyId = async (provider: ethers.providers.Provider) => {
  const contract = getReadOnlyContract(provider);
  return contract.nextBountyId();
};

/**
 * Get admin address
 * @param provider - Ethers provider
 * @returns Admin address
 */
export const getAdmin = async (provider: ethers.providers.Provider) => {
  const contract = getReadOnlyContract(provider);
  return contract.admin();
};

/**
 * Get contract owner
 * @param provider - Ethers provider
 * @returns Owner address
 */
export const getOwner = async (provider: ethers.providers.Provider) => {
  const contract = getReadOnlyContract(provider);
  return contract.owner();
};

/**
 * Get token balance of an address
 * @param provider - Ethers provider
 * @param address - Address to check
 * @returns Balance
 */
export const getBalanceOf = async (provider: ethers.providers.Provider, address: string) => {
  const contract = getReadOnlyContract(provider);
  return contract.balanceOf(address);
};

/**
 * Get owner of a token
 * @param provider - Ethers provider
 * @param tokenId - Token ID
 * @returns Owner address
 */
export const getOwnerOf = async (provider: ethers.providers.Provider, tokenId: string | number) => {
  const contract = getReadOnlyContract(provider);
  return contract.ownerOf(tokenId);
};

/**
 * Get token URI
 * @param provider - Ethers provider
 * @param tokenId - Token ID
 * @returns Token URI
 */
export const getTokenURI = async (provider: ethers.providers.Provider, tokenId: string | number) => {
  const contract = getReadOnlyContract(provider);
  return contract.tokenURI(tokenId);
};

/**
 * Approve address for a token
 * @param signer - Ethers signer
 * @param to - Address to approve
 * @param tokenId - Token ID
 * @returns Transaction receipt
 */
export const approve = async (
  signer: ethers.Signer,
  to: string,
  tokenId: string | number
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('approve', [to, tokenId]);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Approve transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error approving token:', error);
    throw error;
  }
};

/**
 * Get approved address for a token
 * @param provider - Ethers provider
 * @param tokenId - Token ID
 * @returns Approved address
 */
export const getApproved = async (provider: ethers.providers.Provider, tokenId: string | number) => {
  const contract = getReadOnlyContract(provider);
  return contract.getApproved(tokenId);
};

/**
 * Set approval for all tokens
 * @param signer - Ethers signer
 * @param operator - Operator address
 * @param approved - Approval status
 * @returns Transaction receipt
 */
export const setApprovalForAll = async (
  signer: ethers.Signer,
  operator: string,
  approved: boolean
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('setApprovalForAll', [operator, approved]);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Set approval for all transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error setting approval for all:', error);
    throw error;
  }
};

/**
 * Check if an operator is approved for all tokens
 * @param provider - Ethers provider
 * @param owner - Owner address
 * @param operator - Operator address
 * @returns Approval status
 */
export const isApprovedForAll = async (
  provider: ethers.providers.Provider,
  owner: string,
  operator: string
) => {
  const contract = getReadOnlyContract(provider);
  return contract.isApprovedForAll(owner, operator);
};

/**
 * Transfer a token
 * @param signer - Ethers signer
 * @param from - From address
 * @param to - To address
 * @param tokenId - Token ID
 * @returns Transaction receipt
 */
export const transferFrom = async (
  signer: ethers.Signer,
  from: string,
  to: string,
  tokenId: string | number
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const sender = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('transferFrom', [from, to, tokenId]);
    
    const txHash = await sendTransaction(sender, CONTRACT_ADDRESS, data);
    console.log("Transfer transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error transferring token:', error);
    throw error;
  }
};

/**
 * Safe transfer a token
 * @param signer - Ethers signer
 * @param from - From address
 * @param to - To address
 * @param tokenId - Token ID
 * @param data - Additional data
 * @returns Transaction receipt
 */
export const safeTransferFrom = async (
  signer: ethers.Signer,
  from: string,
  to: string,
  tokenId: string | number,
  data?: string
) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const sender = await signer.getAddress();
    
    let txData;
    if (data) {
      txData = contract.interface.encodeFunctionData('safeTransferFrom(address,address,uint256,bytes)', [from, to, tokenId, data]);
    } else {
      txData = contract.interface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [from, to, tokenId]);
    }
    
    const txHash = await sendTransaction(sender, CONTRACT_ADDRESS, txData);
    console.log("Safe transfer transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error safe transferring token:', error);
    throw error;
  }
};

/**
 * Get contract name
 * @param provider - Ethers provider
 * @returns Contract name
 */
export const getName = async (provider: ethers.providers.Provider) => {
  const contract = getReadOnlyContract(provider);
  return contract.name();
};

/**
 * Get contract symbol
 * @param provider - Ethers provider
 * @returns Contract symbol
 */
export const getSymbol = async (provider: ethers.providers.Provider) => {
  const contract = getReadOnlyContract(provider);
  return contract.symbol();
};

/**
 * Check if contract supports interface
 * @param provider - Ethers provider
 * @param interfaceId - Interface ID
 * @returns Support status
 */
export const supportsInterface = async (
  provider: ethers.providers.Provider,
  interfaceId: string
) => {
  const contract = getReadOnlyContract(provider);
  return contract.supportsInterface(interfaceId);
};

/**
 * Transfer contract ownership
 * @param signer - Ethers signer
 * @param newOwner - New owner address
 * @returns Transaction receipt
 */
export const transferOwnership = async (signer: ethers.Signer, newOwner: string) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('transferOwnership', [newOwner]);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Transfer ownership transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error transferring ownership:', error);
    throw error;
  }
};

/**
 * Renounce ownership
 * @param signer - Ethers signer
 * @returns Transaction receipt
 */
export const renounceOwnership = async (signer: ethers.Signer) => {
  await ensureCorrectNetwork(signer);
  
  try {
    const contract = getContract(signer);
    const from = await signer.getAddress();
    
    const data = contract.interface.encodeFunctionData('renounceOwnership', []);
    
    const txHash = await sendTransaction(from, CONTRACT_ADDRESS, data);
    console.log("Renounce ownership transaction sent:", txHash);
    
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    
    return {
      receipt,
      txHash
    };
  } catch (error) {
    console.error('Error renouncing ownership:', error);
    throw error;
  }
}; 