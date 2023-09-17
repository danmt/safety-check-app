import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  HdDisconnectWalletDirective,
  HdObscureAddressPipe,
  HdSelectAndConnectWalletDirective,
  HdWalletAdapterDirective,
  HdWalletIconComponent,
} from '@heavy-duty/wallet-adapter-cdk';
import { HdWalletModalTriggerDirective } from '@heavy-duty/wallet-adapter-material';
import { DeviceApiService } from '../device';
import { InspectorApiService } from '../inspector';
import { SafetyCheckApiService } from '../safety-check';
import { SiteApiService } from '../site';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'safety-check-app-sidebar',
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        #sideNav
        mode="side"
        [opened]="true"
        [fixedInViewport]="true"
        [disableClose]="true"
        position="end"
        class="w-96"
      >
        <header
          class="border-b border-gray-800 flex gap-2 items-center px-4 py-2 bg-white bg-opacity-5"
          *hdWalletAdapter="
            let wallet = wallet;
            let connected = connected;
            let publicKey = publicKey;
            let wallets = wallets
          "
        >
          <ng-container *ngIf="wallet && publicKey && connected">
            <div
              class="bg-black bg-opacity-20 w-12 h-12 rounded-full flex justify-center items-center"
            >
              <hd-wallet-icon [hdWallet]="wallet"></hd-wallet-icon>
            </div>

            <h2 class="flex-grow">
              <span>Connected as</span>
              <span class="italic font-bold">
                {{ publicKey.toBase58() | hdObscureAddress }}
              </span>
            </h2>

            <button
              mat-mini-fab
              aria-label="Disconnect your wallet"
              hdDisconnectWallet
              #disconnectWallet="hdDisconnectWallet"
              (click)="disconnectWallet.run()"
              color="warn"
            >
              <mat-icon>logout</mat-icon>
            </button>
          </ng-container>

          <ng-container *ngIf="!connected">
            <div
              class="bg-black bg-opacity-20 text-red-500 w-12 h-12 rounded-full flex justify-center items-center"
            >
              <mat-icon>priority_high</mat-icon>
            </div>

            <h2 class="flex gap-2 items-center flex-grow">Not Connected</h2>

            <button
              mat-mini-fab
              aria-label="Disconnect your wallet"
              hdWalletModalTrigger
              #walletModalTrigger="hdWalletModalTrigger"
              hdSelectAndConnectWallet
              #selectAndConnectWallet="hdSelectAndConnectWallet"
              (click)="walletModalTrigger.open(wallets)"
              (hdSelectWallet)="selectAndConnectWallet.run($event)"
            >
              <mat-icon>login</mat-icon>
            </button>
          </ng-container>
        </header>

        <div class="p-4">
          <mat-form-field class="w-full">
            <mat-label> RPC Endpoint </mat-label>
            <input
              matInput
              placeholder="RPC Endpoint"
              name="rpc-endpoint"
              #rpcEndpointControl="ngModel"
              [ngModel]="rpcEndpoint$ | async"
              (ngModelChange)="onRpcEndpointChange($event)"
              required
            />
            <mat-error *ngIf="rpcEndpointControl.invalid">
              RPC Endpoint is required.
            </mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label> Program ID </mat-label>
            <input
              matInput
              placeholder="Program ID"
              name="program-id"
              #programIdControl="ngModel"
              [ngModel]="programId$ | async"
              (ngModelChange)="onProgramIdChange($event)"
              required
            />
            <mat-error *ngIf="programIdControl.invalid">
              Program ID is required.
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            (click)="onReload()"
            class="w-full"
          >
            Reload
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    HdObscureAddressPipe,
    HdWalletAdapterDirective,
    HdWalletIconComponent,
    HdDisconnectWalletDirective,
    HdSelectAndConnectWalletDirective,
    HdWalletModalTriggerDirective,
  ],
})
export class SidebarComponent {
  private readonly _connectionService = inject(ConnectionService);
  private readonly _siteApiService = inject(SiteApiService);
  private readonly _deviceApiService = inject(DeviceApiService);
  private readonly _inspectorApiService = inject(InspectorApiService);
  private readonly _safetyCheckApiService = inject(SafetyCheckApiService);

  readonly rpcEndpoint$ = this._connectionService.rpcEndpoint$;
  readonly programId$ = this._connectionService.programId$;

  onRpcEndpointChange(rpcEndpoint: string) {
    this._connectionService.setRpcEndpoint(rpcEndpoint);
  }

  onProgramIdChange(programId: string) {
    this._connectionService.setProgramId(programId);
  }

  onReload() {
    this._siteApiService.reloadSites();
    this._deviceApiService.reloadDevices();
    this._inspectorApiService.reloadInspectors();
    this._safetyCheckApiService.reloadSafetyChecks();
  }
}
