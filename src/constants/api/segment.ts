const origin = '/api';

const SegmentURI = {
  segmentURI: `${origin}/projects/:projectKey/segments`,
  segmentExistURI: `${origin}/projects/:projectKey/segments/exists`,
  getSegmentURI: `${origin}/projects/:projectKey/segments/:segmentKey`,
  getSegmentToggleURI: `${origin}/projects/:projectKey/segments/:segmentKey/toggles`,
};

export default SegmentURI;