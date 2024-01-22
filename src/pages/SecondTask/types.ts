export interface WorkPlace {
  id: number;
  organization: string | null;
  startYear: number | null;
  endYear: number | null;
}

export interface FormFields {
  fullName: string | null;
  dateOfBirth: string | null;
  sex: 'male' | 'female' | null;
  email: string | null;
  workPlaces: WorkPlace[];
}

export interface WorkPlaceError {
  id: number,
  organization: string,
  startYear: string,
  endYear: string,
}

export interface FormFieldsErrors {
  fullName: string | null;
  dateOfBirth: string | null;
  sex: string | null;
  email: string | null;
  workPlaces: WorkPlaceError[];
}
