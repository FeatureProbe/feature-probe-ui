let origin = '/api';

const ToggleURI = {
  getToggleListURI: `${origin}/projects/:projectKey/toggles`,
  getToggleInfoURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  targetingURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/targeting`,
  createToggleURI: `${origin}/projects/:projectKey/toggles`,
  editToggleURI: `${origin}/projects/:projectKey/toggles/:toggleKey`,
  tagsURI: `${origin}/projects/:projectKey/tags`,
  merticsURI: `${origin}/projects/:projectKey/environments/:environmentKey/toggles/:toggleKey/metrics`,
}

export default ToggleURI;