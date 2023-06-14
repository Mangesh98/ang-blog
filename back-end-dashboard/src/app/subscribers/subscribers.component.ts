import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent implements OnInit {
  subscribersData$!: Observable<any>;
  constructor(private subscriberService: SubscribersService) {}

  ngOnInit(): void {
    this.subscribersData$ = this.subscriberService.loadData();
  }

  onDelete(id: string) {
    this.subscriberService.deleteData(id);
  }
}
