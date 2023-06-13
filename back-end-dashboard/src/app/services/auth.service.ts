import { Injectable } from '@angular/core';

import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isloggedInGuard: boolean = false;
  constructor(
    private auth: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;
        // console.log('Logged in user:', user);
        this.toastr.success('Logged In Successfully ..!');
        return this.loadUser()
          .then((loadedUser) => {
            // Combine the logged-in user and loaded user information
            const mergedUser = { ...user, ...loadedUser };
            // console.log('Merged user information:', mergedUser);
            this.loggedIn.next(true);
            this.isloggedInGuard = true;
            this.router.navigate(['/']);
            return mergedUser;
          })
          .catch((error) => {
            console.log('Error loading user information:', error);
            return user;
          });

        // Add your desired logic after successful login
      })
      .catch((error) => {
        this.toastr.warning(error);
        // Add your error handling logic here
      });
  }
  loadUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('No user is currently logged in.'));
        }
        unsubscribe();
      });
    });
  }
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }

  isloggedIn() {
    return this.loggedIn.asObservable();
  }

  async logout(): Promise<void> {
    // Clear user data from local storage and sign out
    localStorage.removeItem('currentUser');
    this.isloggedInGuard = false;
    try {
      await this.auth.signOut();
      // Navigate to '/login' after successful logout
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Logout error:', error);
      throw error;
    }
  }
}
