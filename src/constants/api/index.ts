import project from './project';
import toggle from './toggle';
import user from './user';
import member from './member';
import misc from "./misc";
import segment from './segment';
import dictionary from './dictionary';

const APIS = {
  ...project,
  ...toggle,
  ...user,
  ...member,
  ...segment,
  ...dictionary,
  ...misc,
}

export default APIS;
