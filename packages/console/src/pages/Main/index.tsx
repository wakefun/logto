import { Component, GeneralEvent } from '@logto/app-insights/custom-event';
import { TrackOnce } from '@logto/app-insights/react';
import { useMemo } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { SWRConfig } from 'swr';

import Toast from '@/components/Toast';
import { getBasename } from '@/consts';
import AppBoundary from '@/containers/AppBoundary';
import AppContent from '@/containers/AppContent';
import ConsoleContent from '@/containers/ConsoleContent';
import useSwrOptions from '@/hooks/use-swr-options';
import Callback from '@/pages/Callback';
import Welcome from '@/pages/Welcome';

import HandleSocialCallback from '../Profile/containers/HandleSocialCallback';

function Main() {
  const swrOptions = useSwrOptions();
  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="callback" element={<Callback />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="handle-social" element={<HandleSocialCallback />} />
            <Route element={<AppContent />}>
              <Route path="/*" element={<ConsoleContent />} />
            </Route>
          </>
        ),
        { basename: getBasename() }
      ),
    []
  );

  return (
    <SWRConfig value={swrOptions}>
      <AppBoundary>
        <TrackOnce component={Component.Console} event={GeneralEvent.Visit} />
        <Toast />
        <RouterProvider router={router} />
      </AppBoundary>
    </SWRConfig>
  );
}

export default Main;
