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
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private storage = getStorage();
  conllectionInstance = collection(this.firestore, 'posts');

  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async uploadImg(file: File, postData: any, formStatus: string, id: string) {
    const storagePath = `postIMG/${Date.now()}`;
    const storageRef = ref(this.storage, storagePath);
    const downloadURL = await getDownloadURL(storageRef);
    postData.postImgPath = downloadURL;

    if (formStatus == 'Edit') {
      this.updateData(id, postData);
    } else {
      this.saveData(postData);
    }
  }

  saveData(postData: any) {
    addDoc(this.conllectionInstance, postData)
      .then(() => {
        this.toastr.success('Data inserted successfully ..!');
      })
      .catch(() => {
        this.toastr.error('Faild to insert Data ..!');
      });
    this.router.navigate(['/posts']);
  }
  loadData() {
    // collectionData(this.conllectionInstance, { idField: 'id' }).subscribe(
    //   () => {}
    // );
    return collectionData(this.conllectionInstance, { idField: 'id' });
  }
  updateData(id: string, updateData: any) {
    const docInstance = doc(this.firestore, 'posts', id);
    updateDoc(docInstance, updateData).then(() => {
      this.toastr.success('Data Updated Successfully ..!');
      this.router.navigate(['/posts']);
    });
  }
  async deleteImage(downloadURL: any, id: string) {
    const imageRef = ref(getStorage(), downloadURL);
    await deleteObject(imageRef);
    this.deleteData(id);
  }
  deleteData(id: string) {
    const docInstance = doc(this.firestore, 'posts', id);
    deleteDoc(docInstance).then(() => {
      this.toastr.warning('Data Deleted..!');
    });
  }

  markFeatured(id: string, updateData: any) {
    const docInstance = doc(this.firestore, 'posts', id);
    updateDoc(docInstance, updateData).then(() => {
      this.toastr.info('Featured Status Updated');
    });
  }
}
