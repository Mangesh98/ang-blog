import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  conllectionInstance = collection(this.firestore, 'categories');
  saveData(data: any) {
    addDoc(this.conllectionInstance, data)
      .then(() => {
        // console.log(docRef);
        this.toastr.success('Data inserted successfully ..!');
      })
      .catch(() => {
        // console.log(err);
        this.toastr.error('Faild to insert Data ..!');
      });
  }
  loadData() {
    collectionData(this.conllectionInstance, { idField: 'id' }).subscribe(
      (val) => {
        // console.log(val);
      }
    );
    return collectionData(this.conllectionInstance, { idField: 'id' });
  }
  updateData(id: string, updateData: any) {
    const docInstance = doc(this.firestore, 'categories', id);
    updateDoc(docInstance, updateData).then(() => {
      this.toastr.success('Data Updated Successfully ..!');
    });
  }
  deleteData(id: string) {
    const docInstance = doc(this.firestore, 'categories', id);
    deleteDoc(docInstance).then(() => {
      this.toastr.warning('Data Deleted..!');
    });
  }
}
