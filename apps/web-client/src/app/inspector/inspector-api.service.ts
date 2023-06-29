import { Injectable, inject } from '@angular/core';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  concatMap,
  firstValueFrom,
} from 'rxjs';
import { ConnectionService } from '../core';
import { IDL, SafetyCheckManager } from '../safety_check_manager';
import { Inspector } from './inspector.model';

export interface CreateInspectorParams {
  siteId: string;
  owner: string;
}

@Injectable({
  providedIn: 'root',
})
export class InspectorApiService {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _walletStore = inject(WalletStore);
  private readonly _connectionService = inject(ConnectionService);
  private readonly _reload = new BehaviorSubject(false);

  readonly inspectors$: Observable<Inspector[]> = combineLatest([
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

      const inspectorAccounts = await program.account.inspector.all();

      return inspectorAccounts.map(({ account, publicKey }) => ({
        owner: account.owner,
        siteId: account.siteId,
        authority: account.authority,
        publicKey: publicKey,
      }));
    })
  );

  reloadInspectors() {
    this._reload.next(true);
  }

  async createInspector(params: CreateInspectorParams) {
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

    const [inspectorPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('inspector', 'utf-8'),
        Buffer.from(params.siteId, 'utf-8'),
        new PublicKey(params.owner).toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .createInspector(params.siteId)
      .accounts({
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        site: sitePubkey,
        inspector: inspectorPubkey,
        owner: new PublicKey(params.owner),
      })
      .rpc();

    console.log('success');
  }
}
