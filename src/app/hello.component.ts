import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { Observable, of, empty, BehaviorSubject, Subject, from } from "rxjs";
import { map, tap, delay, switchMap } from "rxjs/operators";

let counter = 100;

function getDataFromService() {
  counter += 5;
  return of({ count: counter }).pipe(delay(1000));
}

@Component({
  selector: "hello",
  template: `
    <button (click)="onClick()" [style.width.px]="input?.offsetWidth || 100">Query service</button>
    <ng-container *ngIf="(data$ | async) as data">
    <br>
    <input #id />
    <h3><ng-container *ngIf="(loading | async)">Loading...</ng-container></h3>
    <h1>Count {{ data.count }}</h1>
    </ng-container>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
      h3 {
        height: 20px;
      }
    `
  ]
})
export class HelloComponent {
  loading = new BehaviorSubject<boolean>(false);
  buttonClicked = new Subject();

  data$ = this.buttonClicked.pipe(
    tap(() => this.loading.next(true)),
    switchMap(() => getDataFromService()),
    tap(() => this.loading.next(false))
  );

  input: HTMLInputElement;

  _element: ElementRef;
  @ViewChild('id', {static:false}) set element(value: ElementRef) {
    this._element = value;
    if(value){
      this.input = value.nativeElement;
    }
  }
  get element(){
    return this._element;
  }

  onClick() {
    this.buttonClicked.next();
  }
}
