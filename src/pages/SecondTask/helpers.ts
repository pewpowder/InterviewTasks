import type {
  FormFields,
  FormFieldsErrors,
  WorkPlace,
  WorkPlaceError,
} from './types';

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

export const validateField = (
  target: EventTarget & HTMLInputElement,
  formFields: FormFields,
  formFieldsErrors: FormFieldsErrors
) => {
  const { name, value } = target;
  const match = name.match(/\d+/);
  const key = match === null ? name : 'workPlaces';

  let error: string | FormFieldsErrors['workPlaces'] | null = null;
  switch (key) {
    case 'fullName': {
      if (value.trim().split(' ').length < 3) {
        error = 'Поле ФИО должно содержать не менее 3-ех слов!';
      }
      break;
    }
    case 'email': {
      const reg = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

      if (!reg.test(value)) {
        error = 'Введен не корректный формат почты!';
      }
      break;
    }
    case 'workPlaces': {
      const workPlacesErrors = validateWorkPlaces({
        name,
        value,
        formFields,
        workPlacesErrors: formFieldsErrors.workPlaces,
        match: match as RegExpMatchArray,
      });

      error = workPlacesErrors;
      break;
    }
    default: {
      console.log(`This error key doesn't exist ${key}`);
      break;
    }
  }

  return {
    name: key,
    error,
    isError: error !== null,
  };
};

interface WorkPlaceValidateInfo {
  name: string;
  value: string;
  formFields: FormFields;
  workPlacesErrors: WorkPlaceError[];
  match: RegExpMatchArray;
}

const validateWorkPlaces = (validateInfo: WorkPlaceValidateInfo) => {
  const { name, value, formFields, workPlacesErrors, match } = validateInfo;

  const id = Number(match[0]);
  const workPlace = formFields.workPlaces.find((wp) => wp.id === id);
  const key = name.slice(0, name.indexOf('['));

  let error: string | null = null;
  switch (key) {
    case 'organization': {
      if (value === '') {
        error = 'Поле не может быть пустым';
      }
      break;
    }
    case 'startYear': {
      if (formFields.dateOfBirth === null) {
        error = 'Пожалуйста, заполните сперва поле "Дата рождения"';
        break;
      }

      const yearOfBirth = new Date(formFields.dateOfBirth).getFullYear();
      const year = Number(value);
      const minYear = Number(yearOfBirth) + 18;
      const maxYear = new Date().getFullYear();

      if (year < minYear || year > maxYear) {
        error = `Поле не может быть больше ${maxYear} и меньше ${minYear}`;
      }

      break;
    }
    case 'endYear': {
      const workPlaces = formFields.workPlaces;
      const isLastWorkPlace = workPlaces[workPlaces.length - 1].id === id;
      if (value === '' && isLastWorkPlace) {
        break;
      }

      const year = Number(value);
      const minYear = workPlace && workPlace.startYear;
      const maxYear = new Date().getFullYear();

      if (!minYear) {
        error = 'Пожалуйста, заполните сперва поле "Год начала работы"';
        break;
      }

      if (minYear && (year < minYear || year > maxYear)) {
        error = `Поле не может быть меньше ${minYear} и больше ${maxYear}`;
      }

      break;
    }
    default: {
      console.log("Workplace with such id doesn't exist");
      break;
    }
  }

  const workPlaceError = workPlacesErrors.find((wpe) => wpe.id === id);

  if (!workPlaceError && !error) {
    return workPlacesErrors;
  }

  if (workPlaceError) {
    return workPlacesErrors.map((wpe) => {
      if (wpe.id === id) {
        return {
          ...wpe,
          [key]: error,
        };
      }
      return wpe;
    });
  }

  return [
    ...workPlacesErrors,
    {
      id,
      organization: null,
      startYear: null,
      endYear: null,
      [key]: error,
    },
  ];
};
