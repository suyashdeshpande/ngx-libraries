import {ChangeDetectionStrategy, Component, forwardRef, Injector} from '@angular/core';
import {ControlContainer, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';
import {FormInputBase} from '../common/base.class';

@Component({
  selector: 'ngx-password',
  templateUrl: 'ngx-password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxPasswordComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxPasswordComponent),
      multi: true
    }
  ],
  // viewProviders: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: NgForm
  //   }
  // ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NgxPasswordComponent extends FormInputBase {
  constructor(public injector: Injector) {
    super(injector);
  }
}
