import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, SidebarComponent } from './core';

@Component({
  selector: 'safety-check-app-root',
  template: `
    <div class="flex">
      <main class="grow">
        <safety-check-app-navbar></safety-check-app-navbar>

        <router-outlet></router-outlet>
      </main>

      <safety-check-app-sidebar></safety-check-app-sidebar>
    </div>
  `,
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
})
export class AppComponent {}
