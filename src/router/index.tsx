import { useEffect, useCallback, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { headerRoutes, blankRoutes } from './routes';
import BasicLayout from '../layout/BasicLayout';
import { getRedirectUrl } from 'utils/getRedirectUrl';

const Router = () => {
  const [ redirectUrl, setRedirectUrl ] = useState<string>('');
  const init = useCallback(async() => {
    if (window.location.pathname === '/login') {
      return;
    }
    const redirectUrl = await getRedirectUrl('/notfound');
    setRedirectUrl(redirectUrl);
  }, []);

  useEffect(() => {
    init();
  }, [init])

  return (
    <BrowserRouter>
      <Switch>
        {
          blankRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={props => (
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
                    render={props => (
                      <Route key={route.path} exact path={route.path} component={route.component} />
                    )}
                  />
                )
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
};

export default Router;
