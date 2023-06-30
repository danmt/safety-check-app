import { inject, Injectable } from '@angular/core';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  firstValueFrom,
  Observable,
} from 'rxjs';
import { ConnectionService } from '../core';
import { IDL, SafetyCheckManager } from '../safety_check_manager';
import { Site } from './site.model';

export interface CreateSiteParams {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class SiteApiService {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _walletStore = inject(WalletStore);
  private readonly _connectionService = inject(ConnectionService);
  private readonly _reload = new BehaviorSubject(false);

  readonly sites$: Observable<Site[]> = combineLatest([
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

      const siteAccounts = await program.account.site.all();

      return siteAccounts.map(({ account, publicKey }) => ({
        id: account.siteId,
        authority: account.authority,
        publicKey: publicKey,
      }));
    })
  );

  reloadSites() {
    this._reload.next(true);
  }

  async createSite(params: CreateSiteParams) {
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
      [Buffer.from('site', 'utf-8'), Buffer.from(params.id, 'utf-8')],
      program.programId
    );

    await program.methods
      .createSite(params.id)
      .accounts({
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        site: sitePubkey,
      })
      .rpc();
  }
}
