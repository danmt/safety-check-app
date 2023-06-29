import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  HdObscureAddressPipe,
  HdWalletAdapterDirective,
} from '@heavy-duty/wallet-adapter-cdk';
import { HdWalletMultiButtonComponent } from '@heavy-duty/wallet-adapter-material';

@Component({
  selector: 'safety-check-app-root',
  template: `
    <main>
      <h1>Safety Check App</h1>

      <section>
        <h2>Sites</h2>

        <div>
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
      </section>
    </main>
  `,
  standalone: true,
  imports: [
    NgIf,
    HdObscureAddressPipe,
    HdWalletMultiButtonComponent,
    HdWalletAdapterDirective,
  ],
})
export class AppComponent {
  title = 'web-client';
}
