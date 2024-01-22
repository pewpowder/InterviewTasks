import { useRef, useState } from 'react';
import type {
  WorkPlace,
  FormFields,
  FormFieldsErrors,
} from './types';
import {
  getInitialFormFields,
  getInitialFormFieldsErrors,
  isWorkPlaceErrorKey,
  isWorkPlaceKey,
} from './helpers';
import styles from './SecondTask.module.css';
import WorkPlaces from './components/WorkPlaces';

export default function SecondTaskPage() {
  const [formFields, setFormFields] = useState<FormFields>(
    getInitialFormFields()
  );
  const [formFieldsErrors, setFormFieldsErrors] = useState<FormFieldsErrors>(
    getInitialFormFieldsErrors()
  );
  const workPlacesIdCounter = useRef(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    const match = name.match(/\d+/);

    if (match === null) {
      setFormFields({ ...formFields, [name]: value });
      return;
    }

    const id = Number(match[0]);
    const fieldName = name.slice(0, name.indexOf('['));
    const newWorkPlaces = formFields.workPlaces.map((wp) => {
      if (wp.id !== id || !isWorkPlaceKey(wp, fieldName)) {
        return wp;
      }

      return {
        ...wp,
        [fieldName]: value,
      };
    });

    setFormFields({ ...formFields, workPlaces: newWorkPlaces });
  };

  const addWorkPlace = () => {
    const newWorkPlace: WorkPlace = {
      id: workPlacesIdCounter.current,
      organization: null,
      startYear: null,
      endYear: null,
    };
    const newWorkPlaces = [...formFields.workPlaces, newWorkPlace];
    setFormFields({ ...formFields, workPlaces: newWorkPlaces });
    workPlacesIdCounter.current += 1;
  };

  const removeWorkPlace = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const id = e.currentTarget.id;
    const newWorkPlaces = formFields.workPlaces.filter(
      (wp) => wp.id.toString() !== id
    );
    setFormFields({ ...formFields, workPlaces: newWorkPlaces });
  };

  const resetForm = () => {
    workPlacesIdCounter.current = 0;
    setFormFields(getInitialFormFields());
    setFormFieldsErrors(getInitialFormFieldsErrors());
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  interface WorkPlaceValidateInfo {
    name: string;
    value: string;
    formFields: FormFields;
    match: RegExpMatchArray;
  }

  const validateWorkPlaces = (validateInfo: WorkPlaceValidateInfo) => {
    const { name, value, formFields, match } = validateInfo;

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
        const yearOfBirth = formFields.dateOfBirth;
        const year = Number(value);
        const minYear = Number(yearOfBirth) + 18;
        const maxYear = new Date().getFullYear();

        if (yearOfBirth === null) {
          error = 'Пожалуйста, заполните сперва поле "Дата рождения"';
        }

        if (year < minYear || year > maxYear) {
          error = `Поле не может быть больше ${maxYear} и меньше ${minYear}`;
        }

        break;
      }
      case 'endYear': {
        const year = Number(value);
        const minYear = workPlace && workPlace.startYear;
        const maxYear = new Date().getFullYear();

        if (!minYear) {
          error = 'Пожалуйста, заполните сперва поле "Год начала работы"';
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

    if (formFieldsErrors.workPlaces.length === 0 && error) {
      return [
        {
          id,
          organization: '',
          startYear: '',
          endYear: '',
          [key]: error,
        },
      ];
    }

    if (error) {
      return formFieldsErrors.workPlaces.map((wp) => {
        if (wp.id === id && isWorkPlaceErrorKey(wp, key)) {
          return { ...wp, [key]: error };
        }

        return wp;
      });
    } else {
      return formFieldsErrors.workPlaces.filter(wp => {
        if(wp.id === id) {

        }
      })
    }

    return formFieldsErrors.workPlaces;
  };

  const validateField = (target: EventTarget & HTMLInputElement) => {
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
    };
  };


  return (
    <form
      className={styles['form']}
      name="employeeInfo"
      onSubmit={handleFormSubmit}
    >
      <label>
        Полное имя
        <input
          type="text"
          name="fullName"
          value={formFields['fullName'] ?? ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </label>
      <div>
        <label>
          М
          <input
            type="radio"
            name="sex"
            value="male"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </label>
        <label>
          Ж
          <input
            type="radio"
            name="sex"
            value="female"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </label>
      </div>
      <label>
        Дата рождения
        <input
          type="date"
          name="dateOfBirth"
          value={formFields['dateOfBirth'] ?? ''}
          min="1900-01-01"
          max={`${new Date().getFullYear() - 18}-12-31`}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </label>
      <label>
        Почта
        <input
          type="email"
          name="email"
          value={formFields['email'] ?? ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </label>
      <WorkPlaces
        formFields={formFields}
        handleInputChange={handleInputChange}
        addWorkPlace={addWorkPlace}
        removeWorkPlace={removeWorkPlace}
        handleInputBlur={handleInputBlur}
      />
      <div>
        <button type="reset" onClick={resetForm}>
          Сбросить
        </button>
        <button type="submit">Отправить</button>
      </div>
    </form>
  );
}
