import { PublicKey } from '@solana/web3.js';

export interface Device {
  id: string;
  publicKey: PublicKey;
  siteId: string;
  // Add other properties here
}
