import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CheckDeviceModalComponent } from '../device';

@Component({
  selector: 'safety-check-app-navbar',
  template: `
    <header
      class="flex justify-between bg-white bg-opacity-5 border-b border-gray-800 px-8 py-4"
    >
      <h1 class="text-2xl">
        <a [routerLink]="['/']"> Safety Check App </a>
      </h1>

      <button
        mat-raised-button
        color="primary"
        (click)="onOpenCheckDeviceModal()"
      >
        Check Device
      </button>
    </header>
  `,
  standalone: true,
  imports: [RouterLink, MatButtonModule],
})
export class NavbarComponent {
  private readonly _dialog = inject(MatDialog);

  onOpenCheckDeviceModal() {
    this._dialog.open(CheckDeviceModalComponent);
  }
}
