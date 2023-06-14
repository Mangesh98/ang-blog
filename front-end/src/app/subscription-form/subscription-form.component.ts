import { Component } from '@angular/core';
import { Sub } from '../models/sub';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css'],
})
export class SubscriptionFormComponent {
  isEmailError: boolean = false;
  isSubscribed: boolean = false;
  constructor(private subService: SubscribersService) {}
  onSubmit(formVal: any) {
    const subData: Sub = {
      name: formVal.name,
      email: formVal.email,
    };
    this.subService.isEmailAlreadyUsed(subData.email).then((emailUsed) => {
      if (!emailUsed) {
        this.subService.addSubs(subData);
        this.isSubscribed = true;
        this.isEmailError = false;
      } else {
        this.isEmailError = true;
      }
    });
  }
}
