import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(component: unknown): boolean {
    return (component as any).canExit ? (component as any).canExit() : true;
  }
}
