import Project from '../pages/project';
import Toggle from '../pages/toggle';
import Targeting from '../pages/targeting';
import Member from '../pages/member';
import Profile from '../pages/profile';
import NotFound from '../pages/notFound';
import Login from '../pages/login';
import DemoLogin from '../pages/login/demoLogin';
import Segment from '../pages/segment';
import SegmentEdit from '../pages/segmentEdit';
import GetStarted from '../pages/getStarted';
import Approvals from '../pages/approval';
import ProjectSetting from '../pages/projectSetting';

export const PROJECT_PATH = '/projects';
export const TOGGLE_PATH = '/:projectKey/:environmentKey/toggles';
export const SETTING_PATH = '/:projectKey/:environmentKey/settings';
export const SEGMENT_PATH = '/:projectKey/:environmentKey/segments';
export const SEGMENT_ADD_PATH = '/:projectKey/:environmentKey/segments/new';
export const SEGMENT_EDIT_PATH = '/:projectKey/:environmentKey/segments/:segmentKey/:navigation';
export const TARGETING_PATH = '/:projectKey/:environmentKey/:toggleKey/:navigation';
export const GET_STARTED_PATH = '/:projectKey/:environmentKey/:toggleKey/get-started';
export const MEMBER_PATH = '/settings/members';
export const PROFILE_PATH = '/settings/profile';
export const APPROVAL_PATH = '/approvals/:navigation';

const isDemo = localStorage.getItem('isDemo') === 'true';

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
    path: SETTING_PATH,
    exact: true,
    component: ProjectSetting,
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
    path: APPROVAL_PATH,
    exact: true,
    component: Approvals,
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
    component: isDemo? DemoLogin : Login
  }
];
