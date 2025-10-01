import { lazy } from 'react';
import { createHashRouter, Navigate } from 'react-router';

import { HomePage } from '../heroes/pages/home/HomePage';
import { HeroPage } from '@/heroes/pages/hero/HeroPage';
import { AdminPage } from '@/admin/pages/AdminPage';
import { HeroesLayout } from '@/heroes/layouts/HeroesLayout';
import { AdminLayout } from '@/admin/layouts/AdminLayout';

// import { SearchPage } from '@/heroes/pages/search/SearchPage';

const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'));

// export const appRouter = createBrowserRouter([
export const appRouter = createHashRouter([
    {
        path: '/',
        element: <HeroesLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/heroes/:idSlug',
                element: <HeroPage />
            },
            {
                path: '/search',
                element: <SearchPage />
            },
            {
                path: '*',
                element: <Navigate to="/" />
            },
        ]
    },

    {
        path: 'admin',
        element: <AdminLayout />,
        children: [

            {
                index: true,
                element: <AdminPage />
            },
        ],
    },

])