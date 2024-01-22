import styles from '../SecondTask.module.css';
import { FormFields } from '../types';

interface WorkPlacesProps {
  formFields: FormFields;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  removeWorkPlace: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  addWorkPlace: () => void;
}

function WorkPlaces(props: WorkPlacesProps) {
  const {
    formFields,
    handleInputChange,
    removeWorkPlace,
    addWorkPlace,
    handleInputBlur,
  } = props;
  return (
    <fieldset name='workPlaces'>
      <table className={styles['table']}>
        <caption>Список мест работы</caption>
        <thead>
          <tr>
            <td>Организация</td>
            <td>Год начала работы</td>
            <td>Год окончания работы</td>
          </tr>
        </thead>
        <tbody>
          {formFields.workPlaces.map((wp) => {
            const { id, organization, startYear, endYear } = wp;
            return (
              <tr key={id}>
                <td>
                  <input
                    type="text"
                    name={`organization[${id}]`}
                    value={organization ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name={`startYear[${id}]`}
                    value={startYear ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name={`endYear[${id}]`}
                    value={endYear ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    id={id.toString()}
                    onClick={removeWorkPlace}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" onClick={addWorkPlace}>
        Добавить
      </button>
    </fieldset>
  );
}

export default WorkPlaces;
