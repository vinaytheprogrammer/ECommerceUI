import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProfileComponent } from './admin-profile.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/models/user.model';

fdescribe('AdminProfileComponent', () => {
  let component: AdminProfileComponent;
  let fixture: ComponentFixture<AdminProfileComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthManagerService: jasmine.SpyObj<AuthManagerService>;

  const mockUser: User = {
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin'
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'updateUserById']);
    mockAuthManagerService = jasmine.createSpyObj('AuthManagerService', ['getCurrentUserId']);

    await TestBed.configureTestingModule({
      declarations: [AdminProfileComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthManagerService, useValue: mockAuthManagerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user and assign to currentUser', () => {
      mockAuthManagerService.getCurrentUserId.and.returnValue('1');
      mockUserService.getUserById.and.returnValue(of(mockUser));

      fixture.detectChanges(); // triggers ngOnInit

      expect(component.currentUser.username).toBe(mockUser.name);
      expect(component.currentUser.email).toBe(mockUser.email);
      expect(component.currentUser.role).toBe(mockUser.role);
    });

    it('should handle error if user fetch fails', () => {
      mockAuthManagerService.getCurrentUserId.and.returnValue('1');
      mockUserService.getUserById.and.returnValue(throwError(() => new Error('User fetch failed')));

      spyOn(console, 'error');
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith('Error fetching user:', jasmine.any(Error));
    });
  });

  it('toggleEdit should toggle isEditing flag', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('cancelEdit should set isEditing to false', () => {
    component.isEditing = true;
    spyOn(console, 'log');
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
    expect(console.log).toHaveBeenCalledWith('Edit cancelled');
  });

  it('saveChanges should call updateUserById and set isEditing to false', () => {
    component.currentUser = {
      username: 'Updated',
      email: 'updated@example.com',
      role: 'admin',
      id: '1'
    };

    mockUserService.updateUserById.and.returnValue(of(undefined));
    component.isEditing = true;

    component.saveChanges();

    expect(mockUserService.updateUserById).toHaveBeenCalledWith(1, {
      name: 'Updated',
      email: 'updated@example.com',
      role: 'admin'
    });

    expect(component.isEditing).toBeFalse();
  });

  it('saveChanges should handle error on update failure', () => {
    component.currentUser = {
      username: 'ErrorTest',
      email: 'error@example.com',
      role: 'admin',
      id: '1'
    };

    mockUserService.updateUserById.and.returnValue(throwError(() => new Error('Update failed')));
    spyOn(console, 'error');

    component.saveChanges();

    expect(console.error).toHaveBeenCalledWith('Error updating user:', jasmine.any(Error));
    expect(component.isEditing).toBeFalse();
  });
});
