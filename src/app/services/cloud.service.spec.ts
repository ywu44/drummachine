import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing'
import { CloudService } from './cloud.service';

describe('CloudService', () => {
  let service: CloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
