const origin = '/api';

const ToggleURI = {
  getToggleListURI: `${origin}/projects/:projectKey/toggles`,
  getToggleInfoURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  environmentURI: `${origin}/projects/:projectKey/environments`,
  targetingURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting`,
  createToggleURI: `${origin}/projects/:projectKey/toggles`,
  editToggleURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  tagsURI: `${origin}/projects/:projectKey/tags`,
  merticsURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metrics`,
  toggleAccessURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/access`,
  toggleExistURI: `${origin}/projects/:projectKey/toggles/exists`,
  environmentExistURI: `${origin}/projects/:projectKey/environments/exists`,
  targetingVersionsURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/versions`,
  targetingVersionsByVersionURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting/versions/:version`
};

export default ToggleURI;