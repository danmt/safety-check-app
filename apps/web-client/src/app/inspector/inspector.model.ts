import { PublicKey } from '@solana/web3.js';

export interface Inspector {
  publicKey: PublicKey;
  owner: PublicKey;
  siteId: string;
}
