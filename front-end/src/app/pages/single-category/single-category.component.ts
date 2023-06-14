import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-category',
  templateUrl: './single-category.component.html',
  styleUrls: ['./single-category.component.css'],
})
export class SingleCategoryComponent implements OnInit {
  categoryData$!: Observable<any>;
  categoryTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.categoryTitle = val['category'];
      this.categoryData$ = this.postsService.loadCategoryPosts(val['id']);
    });
  }
}
