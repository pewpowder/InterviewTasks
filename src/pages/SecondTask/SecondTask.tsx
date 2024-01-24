import { useRef, useState } from 'react';
import type { WorkPlace, FormFields, FormFieldsErrors } from './types';
import {
  getInitialFormFields,
  getInitialFormFieldsErrors,
  isWorkPlaceKey,
  validateField,
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

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, error } = validateField(
      e.currentTarget,
      formFields,
      formFieldsErrors
    );
    setFormFieldsErrors({ ...formFieldsErrors, [name]: error });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isError = validateForm(e.currentTarget);
    !isError && console.log(formFields);
  };

  const validateForm = (target: EventTarget & HTMLFormElement) => {
    const elements = target.elements;
    let errors: FormFieldsErrors = JSON.parse(JSON.stringify(formFieldsErrors));
    let errorCounts = 0;

    for (let i = 0; i < elements.length; i++) {
      const element = target[i];
      if (element.nodeName !== 'INPUT') {
        continue;
      }
      const { name, error, isError } = validateField(
        element as HTMLInputElement,
        formFields,
        errors
      );
      if (isError) {
        errors = {
          ...errors,
          [name]: error,
        };
        errorCounts++;
      }
    }

    const isValidationError = errorCounts !== 0;
    isValidationError && setFormFieldsErrors(errors);

    return isValidationError;
  };

  const resetForm = () => {
    workPlacesIdCounter.current = 0;
    setFormFields(getInitialFormFields());
    setFormFieldsErrors(getInitialFormFieldsErrors());
  };

  const {
    fullName: fullNameError,
    email: emailError,
    workPlaces: workPlacesErrors,
  } = formFieldsErrors;

  return (
    <form
      className={styles['form']}
      name="employeeInfo"
      onSubmit={handleFormSubmit}
    >
      <label>
        Полное имя
        <input
          className={fullNameError ? styles['input-error'] : ''}
          type="text"
          name="fullName"
          value={formFields['fullName'] ?? ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {fullNameError && (
          <span className={styles['text-error']}>{fullNameError}</span>
        )}
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
          className={emailError ? styles['input-error'] : ''}
          type="email"
          name="email"
          value={formFields['email'] ?? ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {emailError && (
          <span className={styles['text-error']}>{emailError}</span>
        )}
      </label>
      <WorkPlaces
        workPlaces={formFields.workPlaces}
        handleInputChange={handleInputChange}
        addWorkPlace={addWorkPlace}
        removeWorkPlace={removeWorkPlace}
        handleInputBlur={handleInputBlur}
        workPlacesErrors={workPlacesErrors}
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
