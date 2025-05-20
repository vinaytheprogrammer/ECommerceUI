import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/user.model';

fdescribe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3011/users';

const mockUser: User = {
    user_id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new user', () => {
    service.createUser(mockUser).subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should get user count without where clause', () => {
    service.getCount().subscribe(res => {
      expect(res.count).toBe(5);
    });

    const req = httpMock.expectOne(`${apiUrl}/count`);
    expect(req.request.method).toBe('GET');
    req.flush({ count: 5 });
  });

  it('should get all users without filter', () => {
    const users: User[] = [mockUser];
    service.getAllUsers().subscribe(res => {
      expect(res).toEqual(users);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(users);
  });


  it('should get user by ID without filter', () => {
    service.getUserById(1).subscribe(res => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
