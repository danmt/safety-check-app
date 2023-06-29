import { Injectable, inject } from '@angular/core';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from '@solana/web3.js';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  firstValueFrom,
} from 'rxjs';
import { ConnectionService } from '../core';
import { IDL, SafetyCheckManager } from '../safety_check_manager';
import { SafetyCheck } from './safety-check.model';

export interface CreateSafetyCheckParams {
  siteId: string;
  deviceId: string;
  safetyCheckId: string;
  durationInDays: number;
}

@Injectable({
  providedIn: 'root',
})
export class SafetyCheckApiService {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _walletStore = inject(WalletStore);
  private readonly _connectionService = inject(ConnectionService);
  private readonly _reload = new BehaviorSubject(false);

  readonly safetyChecks$: Observable<SafetyCheck[]> = combineLatest([
    this._connectionStore.connection$,
    this._walletStore.anchorWallet$,
    this._connectionService.programId$,
    this._reload,
  ]).pipe(
    concatMap(async ([connection, anchorWallet, programId]) => {
      if (
        connection === null ||
        anchorWallet === undefined ||
        programId === null
      ) {
        return [];
      }

      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        AnchorProvider.defaultOptions()
      );
      const program = new Program<SafetyCheckManager>(IDL, programId, provider);

      const safetyCheckAccounts = await program.account.safetyCheck.all();

      return safetyCheckAccounts.map(({ account, publicKey }) => ({
        id: account.safetyCheckId,
        siteId: account.siteId,
        deviceId: account.deviceId,
        authority: account.authority,
        publicKey: publicKey,
      }));
    })
  );

  reloadSafetyChecks() {
    this._reload.next(true);
  }

  async createSafetyCheck(params: CreateSafetyCheckParams) {
    const [connection, anchorWallet, programId] = await firstValueFrom(
      combineLatest([
        this._connectionStore.connection$,
        this._walletStore.anchorWallet$,
        this._connectionService.programId$,
      ])
    );

    if (
      connection === null ||
      anchorWallet === undefined ||
      programId === null
    ) {
      throw new Error('connection, anchorWallet, or programId is null');
    }

    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      AnchorProvider.defaultOptions()
    );
    const program = new Program<SafetyCheckManager>(IDL, programId, provider);

    const [sitePubkey] = PublicKey.findProgramAddressSync(
      [Buffer.from('site', 'utf-8'), Buffer.from(params.siteId, 'utf-8')],
      program.programId
    );
    const [devicePubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('device', 'utf-8'),
        Buffer.from(params.siteId, 'utf-8'),
        Buffer.from(params.deviceId, 'utf-8'),
      ],
      program.programId
    );
    const [inspectorPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('inspector', 'utf-8'),
        Buffer.from(params.siteId, 'utf-8'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );
    const [safetyCheckPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('safety_check', 'utf-8'),
        Buffer.from(params.siteId, 'utf-8'),
        Buffer.from(params.deviceId, 'utf-8'),
        Buffer.from(params.safetyCheckId, 'utf-8'),
      ],
      program.programId
    );
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    const [safetyCheckMintPubkey] = PublicKey.findProgramAddressSync(
      [Buffer.from('safety_check_mint', 'utf-8'), safetyCheckPubkey.toBuffer()],
      program.programId
    );
    const [deviceSafetyCheckVaultPubkey] = PublicKey.findProgramAddressSync(
      [
        devicePubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        safetyCheckMintPubkey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const [safetyCheckMetadataPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf-8'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        safetyCheckMintPubkey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const [safetyCheckMasterEditionPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf-8'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        safetyCheckMintPubkey.toBuffer(),
        Buffer.from('edition', 'utf-8'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    await program.methods
      .createSafetyCheck(
        params.siteId,
        params.deviceId,
        params.safetyCheckId,
        `Safety check for ${params.deviceId}`,
        'SAFE',
        'https://www.google.com',
        new BN(params.durationInDays)
      )
      .accounts({
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: provider.wallet.publicKey,
        site: sitePubkey,
        device: devicePubkey,
        inspector: inspectorPubkey,
        safetyCheck: safetyCheckPubkey,
        safetyCheckMint: safetyCheckMintPubkey,
        deviceSafetyCheckVault: deviceSafetyCheckVaultPubkey,
        safetyCheckMetadata: safetyCheckMetadataPubkey,
        safetyCheckMasterEdition: safetyCheckMasterEditionPubkey,
      })
      .rpc();

    console.log('success');
  }
}
