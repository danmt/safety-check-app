import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly _rpcEndpoint = new BehaviorSubject(
    'https://rpc.heavyduty.builders'
  );
  private readonly _programId = new BehaviorSubject(
    'GDTrnokf3wNXvnLSAKFbvhqyptV73uuyv2dwYA7tCPop'
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
