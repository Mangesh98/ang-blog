import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  currentUserEmail$: Observable<string> = of('somthing@gmail.com');
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log(currentUser);

    if (currentUser !== null) {
      this.currentUserEmail$ =
        currentUser.email !== null ? of(currentUser.email) : of('');
    }
    this.isLoggedIn$ = this.authService.isloggedIn();
  }
  onLogout() {
    this.authService.logout();
  }
}
