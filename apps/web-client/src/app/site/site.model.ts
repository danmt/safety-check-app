import { PublicKey } from '@solana/web3.js';

export interface Site {
  id: string;
  publicKey: PublicKey;
  authority: PublicKey;
  // Add other properties here
}
