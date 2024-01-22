import type { FormFields, FormFieldsErrors, WorkPlace, WorkPlaceError } from './types';

export const isWorkPlaceKey = (
  workPlace: WorkPlace,
  key: string
): key is keyof WorkPlace => {
  return key in workPlace;
};

export const isWorkPlaceErrorKey = (
  workPlaceError: WorkPlaceError,
  key: string
): key is keyof WorkPlaceError => {
  return key in workPlaceError;
};

export const getInitialFormFields = (): FormFields => {
  return {
    fullName: null,
    dateOfBirth: null,
    sex: null,
    email: null,
    workPlaces: [],
  };
};

export const getInitialFormFieldsErrors = (): FormFieldsErrors => {
  return {
    fullName: null,
    dateOfBirth: null,
    sex: null,
    email: null,
    workPlaces: [],
  };
};

export const validateFullName = () => {

}
