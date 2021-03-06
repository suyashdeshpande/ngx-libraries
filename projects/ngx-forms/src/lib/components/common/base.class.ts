import {
  ChangeDetectorRef,
  DoCheck,
  Injector,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NgForm, NgModel, Validator} from '@angular/forms';

export const VALIDATION_TEXT = {
  min: ':field must be at least :value',
  gt: ':field must be greater than :value',
  gte: ':field must be greater than or equal :value',
  max: ':field must not be greater than :value',
  lt: ':field must be less than :value',
  lte: ':field must be less than or equal :value',
  range: ':field must be between :min and :max',
  digits: ':field must be digits only',
  number: ':field must be a number',
  url: ':field is not a valid url',
  email: ':field must be a valid email address',
  date: ':field is not a valid date',
  minDate: ':field must be after :value',
  minTime: ':field must be after :value',
  maxDate: ':field must be before :value',
  equal: ':field must be equal to :value',
  notEqual: ':field must not be equal to :value',
  equalTo: ':field must be equal to :value',
  notEqualTo: ':field must not be equal to :value',
  required: ':field is required',
  pattern: ':field format is invalid',
  maxLength: ':field must not be greater than :value characters',
  minLength: ':field must not be less than :value characters'
};

export function newId() {
  return 'axxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
}

export function checkType(input: any): String {
  if (!input) {
    return 'undefined';
  }

  if (typeof input === 'string') {
    return 'string';
  }

  if (Array.isArray(input)) {
    return 'array';
  }


  if (typeof input === 'object') {
    return 'object';
  }

  return 'undefined';
}


export function getValidator(validator: string, value?: string, message?: string): any {
  return {
    [validator]: {
      type: validator,
      value: value ? value : true,
      message: message ? message : VALIDATION_TEXT[validator]
    }
  }
}


export function parseValidators(validator: any) {
  let result: any = {};
  switch (checkType(validator)) {
    case 'string':
      result = {
        ...result,
        ...getValidator(validator)
      };
      break;
    case 'array':
      validator.forEach(v => {
        result = {
          ...result,
          ...parseValidators(v)
        };
      });
      break;
    case 'object':
      if (validator.type) {
        result = {
          ...result,
          ...getValidator(validator.type, validator.value, validator.message)
        };
      }
      break;
  }
  return result;
}

export abstract class FormInputBase implements ControlValueAccessor, OnChanges, DoCheck, Validator {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() dropdownPosition = 'bottom';
  @Input() inputId = newId();
  @Input() name = '';
  @Input() type = 'text';
  @Input() hint = '';

  @Input() containerClass = '';
  @Input() inputClass = '';
  @Input() labelClass = '';
  @Input() errorClass = '';
  @Input() hintClass = '';

  @Input() prefixLeft = '';
  @Input() prefixRight = '';
  @Input() prefixLeftIcon = '';
  @Input() prefixRightIcon = '';

  @Input() date: any;
  @Input() mode = 'single';
  @Input() bindLabel = 'title';
  @Input() bindValue: string = undefined;
  @Input() searchFn: any;
  @Input() minTime: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() multiple: boolean;
  @Input() showLabel = true;
  @Input() options: any;
  @Input() checked: boolean;

  @Input() validators: any;
  _validators: any = {};

  @Input() value: any;
  _ngModel: any;
  @Input() readonly = false;
  @Input() disabled = false;

  @ViewChild('inputField') inputField: NgModel;
  onChange = (_: any) => {
  };
  onTouched = () => {
  };
  public _ref: ChangeDetectorRef;
  public form: NgForm;
  private _formDiffer: KeyValueDiffer<string, any>;
  private _differs: KeyValueDiffers;

  initialized = false;

  constructor(public injector: Injector) {
    this._ref = injector.get(ChangeDetectorRef);
    this._differs = injector.get(KeyValueDiffers);
    this.form = injector.get(NgForm);
    this._formDiffer = this._differs.find({}).create();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this._ngModel = this.value;
    }
    if (changes.checked) {
      this._ngModel = this.checked;
    }

    if (this.name) {
      this.label = this.label ? this.label : (this.placeholder ? '' : this.name);
    }

    if (changes.validators) {
      this._validators = parseValidators(this.validators);
    }
    this.markForCheck();
  }

  public ngDoCheck(): void {
    const changes = this.form && this._formDiffer.diff(this.form);
    if (changes) {
      this.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this._ngModel = obj;
    if (!this.initialized) {
      setTimeout(() => {
        this.emitChange();
        this.initialized = true;
      });
    }
    this.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  emitChange() {
    this.onChange(this._ngModel);
    this.markForCheck();
  }

  public validate(c: FormControl) {
    if (this.inputField) {
      return this.inputField.errors;
    }
    return null;
  }

  public markForCheck() {
    setTimeout(() => {
      if (!this._ref['destroyed']) {
        this._ref.markForCheck();
        this._ref.detectChanges();
      }
    });
  }

}
