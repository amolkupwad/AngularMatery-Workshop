import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Customer } from '../model/customers';
import { CustomersBackendService } from '../services/customers-backend.service';

@Component({
  selector: 'my-org-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss'],
})
export class CustomerEditorComponent implements OnInit {
  customer: Observable<Customer>;

  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customersBackendService: CustomersBackendService,
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
    });

    this.customer = this.activatedRoute.paramMap.pipe(
      map(paramMap => paramMap.get('id')),
      switchMap(id => this.customersBackendService.get(parseInt(id, 10))),
      tap(customer => this.customerForm.patchValue({ ...customer })),
    );
  }

  submit(customer: Customer) {
    const customerFormValue = this.customerForm.getRawValue();
    this.customersBackendService
      .update({
        ...customer,
        ...customerFormValue,
      })
      .subscribe(() => this.router.navigate(['../../'], { relativeTo: this.activatedRoute }));
  }

  reset(customer: Customer) {
    this.customerForm.patchValue(customer);
  }
}
