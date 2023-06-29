import { PublicKey } from '@solana/web3.js';

export interface SafetyCheck {
  id: string;
  publicKey: PublicKey;
  siteId: string;
  deviceId: string;
  inspector: PublicKey;
  expiresAt: Date;
  durationInDays: number;
  createdAt: Date;
  mint: PublicKey;
  metadata: PublicKey;
  masterEdition: PublicKey;
  vault: PublicKey;
  // Add other properties here
}
