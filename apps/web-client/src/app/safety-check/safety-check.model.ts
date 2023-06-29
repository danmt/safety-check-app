import { PublicKey } from '@solana/web3.js';

export interface SafetyCheck {
  id: string;
  publicKey: PublicKey;
  siteId: string;
  deviceId: string;
  // Add other properties here
}
