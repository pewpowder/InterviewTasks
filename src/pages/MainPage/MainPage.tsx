import { Link, Outlet } from 'react-router-dom';
import styles from './MainPage.module.css';

function MainPage() {
  return (
    <div className={styles['container']}>
      <nav className={styles['nav']}>
        <Link className={styles['nav-link']} to="/first-task">
          First task
        </Link>
        <Link className={styles['nav-link']} to="/second-task">
          Second task
        </Link>
        <Link className={styles['nav-link']} to="/third-task">
          Third task
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default MainPage;
