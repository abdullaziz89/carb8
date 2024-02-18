import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  private isLoggingIn = false;

  signOut(): void {
    window.sessionStorage.clear();
    this.setLoggedIn(false);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.setLoggedIn(true);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  isLoggedIn(): boolean {
    return this.isLoggingIn;
  }

  setLoggedIn(isLoggedIn: any) {
    this.isLoggingIn = isLoggedIn;
  }

  saveUserRoles(roles: any) {
    window.sessionStorage.setItem('roles', JSON.stringify(roles));
  }

  getUserRoles() {
    if (window.sessionStorage.getItem('roles')) {
      return JSON.parse(window.sessionStorage.getItem('roles')!);
    } else {
      return [];
    }
  }
}
