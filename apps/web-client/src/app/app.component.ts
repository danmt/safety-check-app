import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectionStore } from '@heavy-duty/wallet-adapter';
import { ConnectionService, NavbarComponent, SidebarComponent } from './core';

@Component({
  selector: 'safety-check-app-root',
  template: `
    <safety-check-app-sidebar>
      <safety-check-app-navbar></safety-check-app-navbar>
      <router-outlet></router-outlet>
    </safety-check-app-sidebar>
  `,
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
})
export class AppComponent implements OnInit {
  private readonly _connectionStore = inject(ConnectionStore);
  private readonly _connectionService = inject(ConnectionService);

  ngOnInit() {
    this._connectionStore.setEndpoint(this._connectionService.rpcEndpoint$);
  }
}
