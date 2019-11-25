import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReactiveNotificationService } from '../../../core/notification/reactive-notification.service';

import { CustomersBackendService, RESOURCE_URL } from './customers-backend.service';
import { of } from 'rxjs';
import { Notification } from '../../../core/notification/notification';

describe('CustomersBackendService', () => {
  let service: CustomersBackendService;
  let httpTestingController: HttpTestingController;
  let mockNotificationsService: Partial<ReactiveNotificationService>;

  beforeEach(() => {
    mockNotificationsService = {
      info(message: string, timeout: number = 2000) {},
      warning(message: string, timeout: number = 5000) {},
    };
    spyOn(mockNotificationsService, 'info');
    spyOn(mockNotificationsService, 'warning');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomersBackendService,
        { provide: ReactiveNotificationService, useValue: mockNotificationsService },
      ],
    });

    service = TestBed.get(CustomersBackendService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('loads customer', () => {
    const MOCK_CUSTOMER = { id: 0, name: 'John', surname: 'Snow' };

    service.get(0).subscribe(customer => {
      expect(customer).toEqual(MOCK_CUSTOMER);
    });

    const req = httpTestingController.expectOne(`${RESOURCE_URL}/0`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_CUSTOMER);
  });

  it('searches for customers', () => {
    const MOCK_CUSTOMERS = [{ id: 0, name: 'John', surname: 'Snow' }];

    service.findCustomers('john').subscribe(customer => {
      expect(customer).toEqual(MOCK_CUSTOMERS);
    });

    const req = httpTestingController.expectOne(`${RESOURCE_URL}?q=john`);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_CUSTOMERS);
  });

  it('removes customer', () => {
    service.remove(0).subscribe(customer => {
      expect(customer).toEqual(null);
    });

    const req = httpTestingController.expectOne(`${RESOURCE_URL}/0`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(mockNotificationsService.warning).toHaveBeenCalledTimes(1);
    expect(mockNotificationsService.warning).toHaveBeenCalledWith('Customer removed');
  });
});
