import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  conllectionInstance = collection(this.firestore, 'categories');
  
  constructor(private firestore: Firestore) {}
  loadData() {
    // collectionData(this.conllectionInstance, { idField: 'id' }).subscribe(
    //   () => {
    //     // console.log(val);
    //   }
    // );
    return collectionData(this.conllectionInstance, { idField: 'id' });
  }
}
