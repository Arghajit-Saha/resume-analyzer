import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export async function analyzeResume({ resumeFile, selfDescription, jobDescription }) {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('selfDescription', selfDescription);
    formData.append('jobDescription', jobDescription);

    const res = await api.post('/api/resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchReportById(id) {
  try {
    const res = await api.get(`/api/resume/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
