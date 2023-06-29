import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  HdObscureAddressPipe,
  HdWalletAdapterDirective,
} from '@heavy-duty/wallet-adapter-cdk';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';
import { combineLatest, map } from 'rxjs';
import { ConnectionService } from './core';
import { IDL, SafetyCheckManager } from './safety_check_manager';

@Component({
  selector: 'safety-check-app-root',
  template: `
    <div class="flex">
      <main class="grow">
        <header
          class="bg-white bg-opacity-5 border-b border-gray-800 px-8 py-4"
        >
          <h1 class="text-2xl">Safety Check App</h1>
        </header>

        <router-outlet></router-outlet>
      </main>

      <aside
        class="w-96 border-l bg-white bg-opacity-5 border-gray-800 h-screen"
      >
        <h2 class="text-2xl border-b border-gray-800 p-4">Settings</h2>

        <div class="p-4">
          <div class="mb-4">
            <label for="rpc-endpoint">RPC Endpoint: </label>
            <input
              id="rpc-endpoint"
              type="text"
              [ngModel]="rpcEndpoint$ | async"
              (ngModelChange)="onRpcEndpointChange($event)"
              name="rpc-endpoint"
              class="bg-white bg-opacity-10 px-1 py-0.5 border border-gray-800 rounded"
            />
          </div>

          <div class="mb-4">
            <label for="program-id">Program ID: </label>
            <input
              id="program-id"
              type="text"
              [ngModel]="programId$ | async"
              (ngModelChange)="onProgramIdChange($event)"
              name="program-id"
              class="bg-white bg-opacity-10 px-1 py-0.5 border border-gray-800 rounded"
            />
          </div>

          <div
            *hdWalletAdapter="
              let wallet = wallet;
              let connected = connected;
              let publicKey = publicKey;
              let wallets = wallets
            "
          >
            <p>
              Wallet:
              {{ wallet ? wallet.adapter.name : 'None' }}
            </p>

            <p *ngIf="publicKey">
              Public Key: {{ publicKey.toBase58() | hdObscureAddress }}
            </p>

            <p>Status: {{ connected ? 'connected' : 'disconnected' }}</p>
          </div>

          <hd-wallet-multi-button></hd-wallet-multi-button>
        </div>
      </aside>
    </div>
  `,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterOutlet,
    FormsModule,
    HdObscureAddressPipe,
    HdWalletMultiButtonComponent,
    HdWalletAdapterDirective,
  ],
})
export class AppComponent implements OnInit {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _walletStore = inject(WalletStore);
  private readonly _connectionService = inject(ConnectionService);

  readonly rpcEndpoint$ = this._connectionService.rpcEndpoint$;
  readonly programId$ = this._connectionService.programId$;
  readonly provider$ = combineLatest([
    this._connectionStore.connection$,
    this._walletStore.anchorWallet$,
  ]).pipe(
    map(([connection, anchorWallet]) => {
      if (connection === null || anchorWallet === undefined) {
        return null;
      }

      return new AnchorProvider(
        connection,
        anchorWallet,
        AnchorProvider.defaultOptions()
      );
    })
  );
  readonly program$ = combineLatest([this.programId$, this.provider$]).pipe(
    map(([programId, provider]) => {
      if (programId === null || provider === null) {
        return null;
      }

      return new Program<SafetyCheckManager>(IDL, programId, provider);
    })
  );

  ngOnInit() {
    this._connectionStore.setEndpoint(this.rpcEndpoint$);
  }

  onRpcEndpointChange(rpcEndpoint: string) {
    this._connectionService.setRpcEndpoint(rpcEndpoint);
  }

  onProgramIdChange(programId: string) {
    this._connectionService.setProgramId(programId);
  }
}
