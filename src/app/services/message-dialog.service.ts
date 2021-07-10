import { Injectable } from '@angular/core';
import { DialogService } from '@tomblue/ng2-bootstrap-modal';
import { MessageComponent } from '../shared/message/message.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {

  constructor(private _dialogService: DialogService) { }

  openDialogBox(title, message, msgType): Observable<any> {
    return this._dialogService.addDialog(MessageComponent, {
      title: title,
      message: message,
      msgType: msgType,
      actionButtonText: "Ok",
      showCancelButtun: false,
      cancelButtonText: "Cancel"
    });
  }

  openConfirmationDialogBox(title, message, msgType): Observable<any> {
    return this._dialogService.addDialog(MessageComponent, {
      title: title,
      message: message,
      msgType: msgType,
      actionButtonText: "Ok",
      showCancelButtun: true,
      cancelButtonText: "Cancel"
    });
  }
}
