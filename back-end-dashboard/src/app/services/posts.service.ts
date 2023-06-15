import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
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

  async uploadImg(
    file: File,
    postData: any,
    formStatus: string,
    id: string,
    changeImg: boolean
  ) {
    if (formStatus == 'Edit' && changeImg) {
      // Edit post without changing img
      this.updateData(id, postData);
    } else if (formStatus == 'Edit' && !changeImg) {
      // Edit post with changing img
      const storagePath = `postIMG/${Date.now()}`;
      const storageRef = ref(this.storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      postData.postImgPath = downloadURL;
      this.updateData(id, postData);
    } else {
      // insert new data
      const storagePath = `postIMG/${Date.now()}`;
      const storageRef = ref(this.storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      postData.postImgPath = downloadURL;
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
    const latestQuery = query(
      this.conllectionInstance,
      orderBy('createdAt', 'desc')
    );
    return collectionData(latestQuery, { idField: 'id' });
    // return collectionData(this.conllectionInstance, { idField: 'id' });
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
