import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, of, switchMap, take } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit {
  postData$!: Observable<any>;
  categoryPosts$!: Observable<any>;
  viewsC: number = 0;
  postId: string = '';
  isViewsUpdated: boolean = false;
  private postSubscription: Subscription | undefined;
  private viewsUpdatedMap: { [postId: string]: boolean } = {};
  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  // ngOnInit(): void {
  //   this.route.params.subscribe((val) => {
  //     this.postData$ = this.postsService.loadPostById(val['id']);

  //     this.postData$.subscribe((element) => {
  //       this.categoryPosts$ = this.postsService.loadCategoryPosts(
  //         element.category.categoryId
  //       );
  //     });
  //   });
  // }
  // ngOnInit(): void {
  //   this.route.params.subscribe((val) => {
  //     this.postId = val['id'];

  //     this.postsService.loadPostById(this.postId).subscribe((post) => {
  //       this.postData$ = this.postsService.loadPostById(this.postId);

  //       // Update the views count
  //       // Update the views count only if it hasn't been updated yet
  //       if (!this.isViewsUpdated) {
  //         this.viewsC = post['views'] + 1;
  //         this.postsService.updatePostViews(this.postId, this.viewsC);
  //         this.isViewsUpdated = true;
  //       }

  //       this.postData$.subscribe((element) => {
  //         this.categoryPosts$ = this.postsService.loadCategoryPosts(
  //           element.category.categoryId
  //         );
  //       });
  //     });
  //   });
  // }
  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      const newPostId = val['id'];

      if (this.postId !== newPostId) {
        // Unsubscribe from the previous post's subscription
        this.unsubscribeFromPost();

        this.postId = newPostId;
        this.loadPostData();
      }
    });
  }

  private loadPostData(): void {
    this.postData$ = this.postsService.loadPostById(this.postId).pipe(
      switchMap((post) => {
        // Update the views count only if it hasn't been updated yet
        if (!this.viewsUpdatedMap[post['id']]) {
          this.viewsC = post['views'] + 1;
          this.postsService.updatePostViews(this.postId, this.viewsC);
          this.viewsUpdatedMap[post['id']] = true;
        }

        return this.postsService
          .loadCategoryPosts(post['category'].categoryId)
          .pipe(
            switchMap((categoryPosts) => {
              this.categoryPosts$ = of(categoryPosts);
              return of(post);
            })
          );
      })
    );

    this.postSubscription = this.postData$.subscribe((post) => {
      // Update the postData$ observable when a new post is clicked
      this.postData$ = of(post);
    });
  }

  private unsubscribeFromPost(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
      this.postSubscription = undefined;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromPost();
  }
}