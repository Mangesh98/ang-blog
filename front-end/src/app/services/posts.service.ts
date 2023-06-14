import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  increment,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  collectionInstance = collection(this.firestore, 'posts');
  private viewsUpdatedMap = new Map<string, boolean>();
  constructor(private firestore: Firestore) {}

  markPostViewsUpdated(postId: string): void {
    this.viewsUpdatedMap.set(postId, true);
  }
  loadFeatured() {
    const featuredQuery = query(
      this.collectionInstance,
      where('isFeatured', '==', true),
      limit(4)
    );
    return collectionData(featuredQuery, { idField: 'id' });
  }
  loadLatest() {
    const latestQuery = query(
      this.collectionInstance,
      orderBy('createdAt', 'desc')
    );
    return collectionData(latestQuery, { idField: 'id' });
  }
  loadCategoryPosts(categoryId: string) {
    const categoryQuery = query(
      this.collectionInstance,
      where('category.categoryId', '==', categoryId),
      limit(4)
    );
    return collectionData(categoryQuery, { idField: 'id' });
  }

  loadPostById(postId: string) {
    const postRef = doc(this.collectionInstance, postId);
    return docData(postRef, { idField: 'id' });
  }

  updatePostViews(postId: string, views: number): void {
    const postRef = doc(this.collectionInstance, postId);
    const dataToUpdate = { views: increment(1) };

    updateDoc(postRef, dataToUpdate);
  }
}
