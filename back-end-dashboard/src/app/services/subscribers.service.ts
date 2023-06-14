import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  collectionInstance = collection(this.firestore, 'subscribers');

  loadData() {
    return collectionData(this.collectionInstance, { idField: 'id' });
  }
  deleteData(id: string) {
    const docInstance = doc(this.firestore, 'subscribers', id);
    deleteDoc(docInstance).then(() => {
      this.toastr.warning('subscriber Deleted..!');
    });
  }
}
