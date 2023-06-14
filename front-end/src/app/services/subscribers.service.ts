import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private firestore: Firestore) {}

  collectionInstance = collection(this.firestore, 'subscribers');

  // addSubs(data: any) {
  //   // addDoc(this.collectionInstance, data)
  //   //   .then((docRef) => {
  //   //     console.log(docRef);
  //   //     // this.toastr.success('Data inserted successfully ..!');
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //     // this.toastr.error('Faild to insert Data ..!');
  //   //   });

  //   const email = data.email;
  //   // Check if email is already present in collection
  //   const emailQuery = query(
  //     this.collectionInstance,
  //     where('email', '==', email)
  //   );
  //   getDocs(emailQuery)
  //     .then((querySnapshot) => {
  //       if (querySnapshot.empty) {
  //         // Email does not exist, add subscriber
  //         addDoc(this.collectionInstance, data)
  //           .then((docRef) => {
  //             console.log(docRef);
  //             this.toastr.success('Subscribed successfully!');
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             this.toastr.error('Failed to Subscribe.');
  //           });
  //       } else {
  //         // Email already exists
  //         console.log('Email already exists in the collection.');
  //         // this.toastr.warning('Already Subscriber.');
  //         this.toastr.warning('Email already exists.', 'Warning', {
  //           positionClass: 'toast-bottom-full-width',
  //           closeButton: true,
  //           timeOut: 5000,
  //           extendedTimeOut: 2000,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       //  this.toastr.error('Failed to check for existing email.');
  //     });
  // }

  async addSubs(data: any) {
    try {
      const docRef = await addDoc(this.collectionInstance, data);
      console.log(docRef);
    } catch (err) {
      console.log(err);
    }
  }
  async isEmailAlreadyUsed(email: string): Promise<boolean> {
    try {
      const querySnapshot = await getDocs(query(this.collectionInstance, where('email', '==', email)));
      return !querySnapshot.empty;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
