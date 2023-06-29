import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly _rpcEndpoint = new BehaviorSubject('http://localhost:8899');
  private readonly _programId = new BehaviorSubject(
    '4WJv7r8mzjydzhYRdG3yCGEmZmQT1KQUyxFrT1keaBWC'
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
