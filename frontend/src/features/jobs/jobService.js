import axios from '../../utils/axios';

const API_URL = '/api/jobs';

// Create new job
const createJob = async (jobData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, jobData, config);
  return response.data;
};

const jobService = {
  createJob,
};

export default jobService;
