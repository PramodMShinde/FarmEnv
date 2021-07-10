import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from '@tomblue/ng2-bootstrap-modal';

@Component({
  selector: 'confirm',
  template: `<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-body text-center">
        <div class="mb-4">
            <h6 class="font-weight-normal text-secondary">{{message || 'Are you sure?'}}</h6>
        </div>
        <button type="button" class="btn-footer-fill mr-1 btn-sm" [autofocus]='true' (click)="confirm()">{{actionButtonText}}</button>
        <button type="button" class="btn-footer-outline btn-sm" [hidden]="!showCancelButtun" (click)="cancel()" >{{cancelButtonText}}</button>
        </div>
      </div>
  </div>`
})

export class MessageComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel, DialogOptions {

  title: string;
    message: string;
    msgType: string;
    backdropColor: string = "red";
    actionButtonText: string = "Ok";
    cancelButtonText: string = "Cancel";
    showCancelButtun: boolean = true;
    constructor(dialogService: DialogService) {
        super(dialogService);
    }
    
    confirm() {
      // we set dialog result as true on click on confirm button, 
      // then we can get dialog result from caller code 
      this.result = true;
      this.close();
  }

  cancel() {
      this.result = false;
      this.close();
  }

}

export interface ConfirmModel {
  title: string;
  message: string;
  msgType: string;
  actionButtonText: string;
  cancelButtonText: string;
  showCancelButtun: boolean;
}

interface DialogOptions {
  backdropColor?: string;
}
