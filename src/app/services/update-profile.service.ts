import { Injectable } from '@angular/core';

import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { Clinic } from 'src/app/models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {
  public userProfile!: User | Patient;
  public clinicProfile!: Clinic;

  constructor() { }

  get userProfileToUpdate() {
    const profile = JSON.parse(sessionStorage.getItem('profile-to-show')!);
    this.userProfile = profile;
    return this.userProfile;
  }

  get clinicProfileToUpdate() {
    const profile = JSON.parse(sessionStorage.getItem('profile-to-show')!);
    this.clinicProfile = profile;
    return this.clinicProfile;
  }

  userToUpdate(profile: User | Patient) {
    sessionStorage.setItem('profile-to-show', JSON.stringify(profile));
    this.userProfile = profile;
  }

  get currentPhoto() {
    const photo: string = sessionStorage.getItem('current-photo-profile') || '';
    return photo;
  }

  updatePhoto(photo: string) {
    sessionStorage.setItem('current-photo-profile', photo);
  }

  deletePhoto() {
    sessionStorage.removeItem('current-photo-profile');
  }

  clinicToUpdate(profile: Clinic) {
    sessionStorage.setItem('profile-to-show', JSON.stringify(profile));
    this.clinicProfile = profile;
  }
}
