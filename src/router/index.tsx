import { useEffect, useCallback, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { FPUser, FeatureProbe } from 'featureprobe-client-sdk-js';
import { FormattedMessage } from 'react-intl';
import { Dimmer, Loader } from 'semantic-ui-react';
import { headerRoutes, blankRoutes } from './routes';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import BasicLayout from 'layout/BasicLayout';
import { EventTrack } from 'utils/track';

let USER: FPUser;
let FP: FeatureProbe;

const Router = () => {
  const [ redirectUrl, setRedirectUrl ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const initRedirectUrl = useCallback(async () => {
    if (window.location.pathname === '/login') {
      return;
    }
    const redirectUrl = await getRedirectUrl('/notfound');
    setRedirectUrl(redirectUrl);
  }, []);

  useEffect(() => {
    EventTrack.init();
  }, []);

  const init = useCallback(async() => {
    if (!USER) {
      USER = new FPUser();
    }

    if (!FP) {
      FP = new FeatureProbe({
        togglesUrl: window.location.origin + '/server/api/client-sdk/toggles',
        eventsUrl:  window.location.origin + '/server/api/events',
        clientSdkKey: 'client-29765c7e03e9cb49c0e96357b797b1e47e7f2dee',
        user: USER,
        refreshInterval: 500000,
      });

      window.FP = FP;

      FP.on('ready', () => {
        const result = FP.boolValue('demo_features', false);
        localStorage.setItem('isDemo', result.toString());
        setIsLoading(false);
        initRedirectUrl();
      });

      FP.on('error', () => {
        setIsLoading(false);
        initRedirectUrl();
      });

      FP.start();
    }
  }, [initRedirectUrl]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {
        isLoading ? (
          <Dimmer active inverted>
            <Loader size='small'>
              <FormattedMessage id='common.loading.text' />
            </Loader>
          </Dimmer>
          ) : (
            <BrowserRouter>
              <Switch>
                {
                  blankRoutes.map(route => (
                    <Route
                      key={route.path}
                      path={route.path}
                      exact={route.exact}
                      render={() => (
                        <Route key={route.path} exact path={route.path} component={route.component} />
                      )}
                    />
                  ))
                }
                <BasicLayout>
                  <Switch>
                    {
                      headerRoutes.map(route => {
                        return (
                          <Route
                            key={route.path}
                            path={route.path}
                            exact={route.exact}
                            render={() => (
                              <Route key={route.path} exact path={route.path} component={route.component} />
                            )}
                          />
                        );
                      })
                    }
                    {
                      redirectUrl !== '' && <Redirect from='/' to={redirectUrl} />
                    }
                  </Switch>
                </BasicLayout>
              </Switch>
            </BrowserRouter>
          )
      }
    </>
  );
};

export default Router;
