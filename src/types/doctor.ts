export interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string; // Align with User.id type
  firstname: string;
  lastname: string;
  specialite: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  dateOfBirth: string;
  photo?: string;
  biography?: string;
  availabilities: Availability[];
}

export {};
