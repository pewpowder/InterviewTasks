import { createBrowserRouter } from 'react-router-dom';
import MainPage from 'pages/MainPage/MainPage';
import FirstTaskPage from 'pages/FirstTask/FirstTask';
import SecondTaskPage from 'pages/SecondTask/SecondTask';
import ThirdTaskPage from 'pages/ThirdTask/ThirdTask';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '/first-task',
        element: <FirstTaskPage />,
      },
      {
        path: '/second-task',
        element: <SecondTaskPage />,
      },
      {
        path: '/third-task',
        element: <ThirdTaskPage />,
      },
    ],
  },
]);

export { router };
