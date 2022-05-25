let origin = '/api';

const ProjectURI = {
  addProjectURI: `${origin}/projects`,
  editProjectURI: `${origin}/projects/:projectKey`,
  addEnvironmentURI: `${origin}/projects/:projectKey/environments`,
  editEnvironmentURI: `${origin}/projects/:projectKey/environments/:environmentKey`,
  getProjectListURI: `${origin}/projects`,
  getProjectInfoURI: `${origin}/projects/:projectKey`,
}

export default ProjectURI;