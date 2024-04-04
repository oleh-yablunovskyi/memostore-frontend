import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import QuestionListPage from '../../pages/QuestionListPage';
import NotFoundPage from '../../pages/NotFoundPage';
import { APP_KEYS } from '../../consts';
import QuestionDetailPage from '../../pages/QuestionDetailPage';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/questions" replace />
      },
      {
        path: APP_KEYS.ROUTER_KEYS.QUESTION_LIST_PAGE,
        element: <QuestionListPage />
      },
      {
        path: APP_KEYS.ROUTER_KEYS.QUESTION_DETAIL_PAGE,
        element: <QuestionDetailPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
];
