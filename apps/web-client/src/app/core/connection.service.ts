import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly _rpcEndpoint = new BehaviorSubject(
    'https://api.devnet.solana.com'
  );
  private readonly _programId = new BehaviorSubject(
    '3WdiprEYJGr2Av3BocnFpohHKq6kw6vWLAHtk5Byiizg'
  );

  readonly rpcEndpoint$ = this._rpcEndpoint.asObservable();
  readonly programId$ = this._programId.asObservable();

  setRpcEndpoint(rpcEndpoint: string) {
    this._rpcEndpoint.next(rpcEndpoint);
  }

  setProgramId(programId: string) {
    this._programId.next(programId);
  }
}
