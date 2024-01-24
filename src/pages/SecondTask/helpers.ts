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

interface WorkPlaceValidateInfo {
  name: string;
  value: string;
  formFields: FormFields;
  workPlacesErrors: WorkPlaceError[];
  match: RegExpMatchArray;
}

type ValidationError = string | null;

const validateStartYear = (
  value: string,
  dateOfBirth: string | null
): ValidationError => {
  if (dateOfBirth === null) {
    return 'Пожалуйста, заполните сперва поле "Дата рождения"';
  }

  const yearOfBirth = new Date(dateOfBirth).getFullYear();
  const year = Number(value);
  const minYear = Number(yearOfBirth) + 18;
  const maxYear = new Date().getFullYear();

  if (year < minYear || year > maxYear) {
    return `Поле не может быть больше ${maxYear} и меньше ${minYear}`;
  }

  return null;
};

const validateEndYearError = (
  value: string,
  id: number,
  workPlaces: WorkPlace[]
): ValidationError => {
  const isLastWorkPlace = workPlaces[workPlaces.length - 1].id === id;

  if (value === '' && isLastWorkPlace) {
    return null;
  }

  const year = Number(value);
  const workPlace = workPlaces.find((wp) => wp.id === id);
  const minYear = workPlace && workPlace.startYear;
  const maxYear = new Date().getFullYear();

  if (!minYear) {
    return 'Пожалуйста, заполните сперва поле "Год начала работы"';
  }

  if (minYear && (year < minYear || year > maxYear)) {
    return `Поле не может быть меньше ${minYear} и больше ${maxYear}`;
  }

  return null;
};

// const removeEmptyWorkPlaceError = (workPlaceError: WorkPlaceError) => {
//   return ;
// }

interface WorkPlacesValidationError {
  isWorkPlacesError: boolean;
  workPlacesErrors: WorkPlaceError[];
}

const getValidatedWorkplacesErrors = (
  workPlacesErrors: WorkPlaceError[],
  id: number,
  key: string,
  error: ValidationError
): WorkPlacesValidationError => {
  const workPlaceError = workPlacesErrors.find((wpe) => wpe.id === id);

  if (!workPlaceError && !error) {
    return {
      isWorkPlacesError: false,
      workPlacesErrors,
    };
  }

  if (!workPlaceError && error) {
    return {
      isWorkPlacesError: error !== null,
      workPlacesErrors: [
        ...workPlacesErrors,
        {
          id,
          organization: null,
          startYear: null,
          endYear: null,
          [key]: error,
        },
      ],
    };
  }

  const newWorkPlacesErrors: WorkPlaceError[] = workPlacesErrors.map((wpe) => {
    if (wpe.id === id) {
      return {
        ...wpe,
        [key]: error,
      };
    }
    return wpe;
  });

  return {
    isWorkPlacesError: error !== null,
    workPlacesErrors: newWorkPlacesErrors.filter((wpe) => {
      return Object.entries(wpe).some(([key, value]) => {
        return key === 'id' ? false : value !== null;
      })
    })
  }
};

const validateWorkPlaces = (
  validateInfo: WorkPlaceValidateInfo
): WorkPlacesValidationError => {
  const { name, value, formFields, workPlacesErrors, match } = validateInfo;

  const id = Number(match[0]);

  const key = name.slice(0, name.indexOf('['));

  let error: ValidationError = null;
  switch (key) {
    case 'organization': {
      if (value === '') {
        error = 'Поле не может быть пустым';
      }
      break;
    }
    case 'startYear': {
      error = validateStartYear(value, formFields.dateOfBirth);
      break;
    }
    case 'endYear': {
      error = validateEndYearError(value, id, formFields.workPlaces);
      break;
    }
    default: {
      console.log("Workplace with such id doesn't exist");
      break;
    }
  }

  return getValidatedWorkplacesErrors(workPlacesErrors, id, key, error);
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
  let isError = false;
  switch (key) {
    case 'fullName': {
      if (value.trim().split(' ').length < 3) {
        error = 'Поле ФИО должно содержать не менее 3-ех слов!';
        isError = true;
      }
      break;
    }
    case 'email': {
      const reg = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

      if (!reg.test(value)) {
        error = 'Введен не корректный формат почты!';
        isError = true;
      }
      break;
    }
    case 'workPlaces': {
      const { isWorkPlacesError, workPlacesErrors } = validateWorkPlaces({
        name,
        value,
        formFields,
        workPlacesErrors: formFieldsErrors.workPlaces,
        match: match as RegExpMatchArray,
      });

      isError = isWorkPlacesError;
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
    isError,
  };
};
