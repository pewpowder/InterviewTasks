import styles from '../SecondTask.module.css';
import type { WorkPlace, WorkPlaceError } from '../types';

interface WorkPlacesProps {
  workPlaces: WorkPlace[];
  workPlacesErrors: WorkPlaceError[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  removeWorkPlace: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  addWorkPlace: () => void;
}

function WorkPlaces(props: WorkPlacesProps) {
  const {
    workPlaces,
    workPlacesErrors,
    handleInputChange,
    removeWorkPlace,
    addWorkPlace,
    handleInputBlur,
  } = props;

  return (
    <div>
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
          {workPlaces.map((wp) => {
            const { id, organization, startYear, endYear } = wp;
            const workPlaceError = workPlacesErrors.find(
              (wpe) => wpe.id === id
            );
            const organizationError = workPlaceError?.organization;
            const startYearError = workPlaceError?.startYear;
            const endYearError = workPlaceError?.endYear;
            return (
              <tr key={id}>
                <td>
                  <input
                    className={organizationError ? styles['input-error'] : ''}
                    type="text"
                    name={`organization[${id}]`}
                    value={organization ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  {organizationError && (
                    <span className={styles['text-error']}>
                      {organizationError}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    className={startYearError ? styles['input-error'] : ''}
                    type="number"
                    name={`startYear[${id}]`}
                    value={startYear ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  {startYearError && (
                    <span className={styles['text-error']}>
                      {startYearError}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    className={endYearError ? styles['input-error'] : ''}
                    type="number"
                    name={`endYear[${id}]`}
                    value={endYear ?? ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  {endYearError && (
                    <span className={styles['text-error']}>
                      {endYearError}
                    </span>
                  )}
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
    </div>
  );
}

export default WorkPlaces;
