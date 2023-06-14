import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  featuredPostData$!: Observable<any>;
  letestPostData$!: Observable<any>;
  constructor(private postService: PostsService) {}
  ngOnInit(): void {
    this.featuredPostData$ = this.postService.loadFeatured();
    this.letestPostData$ = this.postService.loadLatest();
  }
}
