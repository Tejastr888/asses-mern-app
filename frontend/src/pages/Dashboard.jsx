import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const JobSeekerDashboard = ({ profile }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications/my-applications');
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {profile?.name}!</h2>
        <p className="mt-2 text-gray-600">Your job search journey continues here.</p>
      </div>

      {/* Profile Completion */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Completion</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Profile Status</span>
            <span className={`px-3 py-1 rounded-full text-sm ${profile ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {profile ? 'Complete' : 'Incomplete'}
            </span>
          </div>
          {!profile && (
            <Link to="/profile" className="text-indigo-600 hover:text-indigo-800">
              Complete your profile to start applying →
            </Link>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
        {loading ? (
          <div className="text-center text-gray-600">Loading applications...</div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.slice(0, 3).map((app) => (
              <div key={app._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{app.job.title}</h4>
                    <p className="text-sm text-gray-600">{app.job.employer.companyName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            <Link to="/applications" className="text-indigo-600 hover:text-indigo-800 block text-sm">
              View all applications →
            </Link>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No applications yet</p>
            <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800 block mt-2">
              Browse available jobs →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const EmployerDashboard = ({ profile }) => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, applicationsRes] = await Promise.all([          axiosInstance.get('/api/jobs/my-jobs'),
          axiosInstance.get('/api/applications/received')
        ]);
        setPostedJobs(jobsRes.data);
        setRecentApplications(applicationsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome, {profile?.companyName}!
        </h2>
        <p className="mt-2 text-gray-600">Manage your job postings and applications here.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Job Posts</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {postedJobs.filter(job => job.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {recentApplications.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {recentApplications.filter(app => app.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          <Link to="/applications" className="text-indigo-600 hover:text-indigo-800 text-sm">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-600">Loading applications...</div>
        ) : recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.slice(0, 3).map((app) => (
              <div key={app._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {app.jobSeeker.name} - {app.job.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No applications received yet</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/jobs/post"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Post New Job
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Update Company Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          user.role === 'employer'
            ? '/api/employers/profile'
            : '/api/jobseekers/profile'
        );
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user.role === 'employer' ? (
        <EmployerDashboard profile={profile} />
      ) : (
        <JobSeekerDashboard profile={profile} />
      )}
    </div>
  );
};

export default Dashboard;
