import { Injectable } from '@angular/core';
import { Patient, PatientSignup } from 'src/app/types/patient';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user?: Patient
  private patient?: PatientSignup
  constructor() { 
    this.user = JSON.parse(localStorage.getItem('user') || '{}')
    this.patient = JSON.parse(localStorage.getItem('patient') || '{}')
  }

  set(user: Patient) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  get(): Patient {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}')
    return user as Patient
  }

  setPatient(patient: PatientSignup) {
    this.patient = patient
    localStorage.setItem('patient', JSON.stringify(patient))
  }

  getPatient(): PatientSignup {
    const patient = this.patient || JSON.parse(localStorage.getItem('patient') || '{}')
    return patient as PatientSignup
  }
}