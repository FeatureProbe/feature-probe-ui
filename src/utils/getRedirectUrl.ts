import localForage from 'localforage';
import { getProjectList } from 'services/project';
import { IProject, IEnvironment } from 'interfaces/project';

export const getRedirectUrl = async (defaultRedirectUrl: string) => {
  let redirectUrl = defaultRedirectUrl;
  const projectKey: string = await localForage.getItem('projectKey') || '';
  const environmentKey: string = await localForage.getItem('environmentKey') || '';

  if (!!projectKey && !!environmentKey) {
    redirectUrl = `/${projectKey}/${environmentKey}/toggles`;
  } else {
    const res = await getProjectList<IProject[]>();
    const { success, data } = res;

    if (success && data) {
      const { key, environments } = data[0];
      let envKey = '';
      environments.some((environment: IEnvironment) => {
        if (environment.key) {
          envKey = environment.key;
          return true;
        }
        return environment;
      });

      if (key && envKey) {
        redirectUrl = `/${key}/${envKey}/toggles`;
      }
    }
  }

  return redirectUrl;
}