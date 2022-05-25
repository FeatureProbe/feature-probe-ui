import Project from '../pages/project';
import Toggle from '../pages/toggle';
import Targeting from '../pages/targeting';
import Member from '../pages/member';
import Profile from '../pages/profile';
import NotFound from '../pages/notFound';
import Login from '../pages/login';

export const PROJECT_PATH = '/projects';
export const TOGGLE_PATH = '/:projectKey/:environmentKey/toggles';
export const TARGETING_PATH = '/:projectKey/:environmentKey/:toggleKey/:navigation';
export const MEMBER_PATH = '/settings/members';
export const PROFILE_PATH = '/settings/profile';

export const headerRoutes = [
  {
    path: PROJECT_PATH,
    exact: true,
    component: Project
  },
  {
    path: TOGGLE_PATH,
    exact: true,
    component: Toggle,
  },
  {
    path: TARGETING_PATH,
    exact: true,
    component: Targeting
  },
  {
    path: MEMBER_PATH,
    exact: true,
    component: Member
  },
  {
    path: PROFILE_PATH,
    exact: true,
    component: Profile
  }
];

export const blankRoutes = [
  {
    path: '/notFound',
    exact: true,
    component: NotFound
  },
  {
    path: '/login',
    exact: true,
    component: Login
  },
];
