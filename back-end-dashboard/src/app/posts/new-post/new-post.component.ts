import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg: any;
  categories!: Observable<any>;
  postData!: Observable<any>;
  postForm!: FormGroup;
  postId: any;
  formStatus: string = 'Add New';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.postId = val['id'];
      if (this.postId) {
        this.postData = postService.loadData();

        this.postData.subscribe({
          next: (data) => {
            // Here you can access the emitted data and perform the desired operations
            for (const obj of data) {
              const id = obj.id;
              if (this.postId == id) {
                console.log(obj);
                
                this.postForm = this.fb.group({
                  title: [
                    obj.title,
                    [Validators.required, Validators.minLength(10)],
                  ],
                  permalink: [obj.permalink, Validators.required],
                  excerpt: [
                    obj.excerpt,
                    [Validators.required, Validators.minLength(50)],
                  ],
                  category: [
                    `${obj.category.categoryId}-${obj.category.category}`,
                    Validators.required,
                  ],
                  postImg: ['', Validators.required],
                  content: [obj.content, Validators.required],
                });
                this.imgSrc = obj.postImgPath;
                this.formStatus = 'Edit';
                break;
              }
            }
          },
          error: (err) => {
            // Handle any errors that occur during the subscription
            console.error('An error occurred:', err);
          },
          complete: () => {
            // This block will be executed when the Observable completes
          },
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }

  get fc() {
    return this.postForm.controls;
  }
  ngOnInit(): void {
    this.categories = this.categoryService.loadData();
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    // this.permalink = title.replace(/^\s+|\s+(?!$)/g, '-');
    this.permalink = title.trim().replace(/\s+/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    let splitted = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'New',
      createdAt: new Date(),
    };
    this.postService.uploadImg(
      this.selectedImg,
      postData,
      this.formStatus,
      this.postId
    );

    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.png';
  }
}
