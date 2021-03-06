import Project from '../pages/project';
import Toggle from '../pages/toggle';
import Targeting from '../pages/targeting';
import Member from '../pages/member';
import Profile from '../pages/profile';
import NotFound from '../pages/notFound';
import Login from '../pages/login';
import Segment from '../pages/segment';
import SegmentEdit from '../pages/segmentEdit';
import GetStarted from '../pages/getStarted';

export const PROJECT_PATH = '/projects';
export const TOGGLE_PATH = '/:projectKey/:environmentKey/toggles';
export const SEGMENT_PATH = '/:projectKey/:environmentKey/segments';
export const SEGMENT_ADD_PATH = '/:projectKey/:environmentKey/segments/new';
export const SEGMENT_EDIT_PATH = '/:projectKey/:environmentKey/segments/:segmentKey/:navigation';
export const TARGETING_PATH = '/:projectKey/:environmentKey/:toggleKey/:navigation';
export const GET_STARTED_PATH = '/:projectKey/:environmentKey/:toggleKey/get-started';
export const MEMBER_PATH = '/settings/members';
export const PROFILE_PATH = '/settings/profile';

export const headerRoutes = [
  {
    path: PROJECT_PATH,
    exact: true,
    component: Project
  },
  {
    path: SEGMENT_ADD_PATH,
    exact: true,
    component: SegmentEdit
  },
  {
    path: SEGMENT_EDIT_PATH,
    exact: true,
    component: SegmentEdit
  },
  {
    path: SEGMENT_PATH,
    exact: true,
    component: Segment
  },
  {
    path: TOGGLE_PATH,
    exact: true,
    component: Toggle,
  },
  {
    path: GET_STARTED_PATH,
    exact: true,
    component: GetStarted
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
  },
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
  }
];
