import { PublicKey } from '@solana/web3.js';

export interface Device {
  id: string;
  publicKey: PublicKey;
  siteId: string;
  expiresAt: Date | null;
  lastSafetyCheck: PublicKey | null;
  inspector: PublicKey | null;
}
