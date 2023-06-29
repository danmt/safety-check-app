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
import { Device } from './device.model';

export interface CreateDeviceParams {
  siteId: string;
  deviceId: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceApiService {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _walletStore = inject(WalletStore);
  private readonly _connectionService = inject(ConnectionService);
  private readonly _reload = new BehaviorSubject(false);

  readonly devices$: Observable<Device[]> = combineLatest([
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

      const deviceAccounts = await program.account.device.all();

      return deviceAccounts.map(({ account, publicKey }) => ({
        id: account.deviceId,
        siteId: account.siteId,
        publicKey,
        expiresAt: account.expiresAt
          ? new Date(account.expiresAt.toNumber() * 1000)
          : null,
        lastSafetyCheck: account.lastSafetyCheck,
        inspector: account.inspector,
      }));
    })
  );

  reloadDevices() {
    this._reload.next(true);
  }

  async createDevice(params: CreateDeviceParams) {
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

    await program.methods
      .createDevice(params.siteId, params.deviceId)
      .accounts({
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        site: sitePubkey,
        device: devicePubkey,
      })
      .rpc();

    console.log('success');
  }
}
