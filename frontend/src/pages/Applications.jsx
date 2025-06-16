import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchApplications, 
  withdrawApplication, 
  updateApplicationStatus,
  scheduleInterview 
} from '../features/applications/applicationsSlice';
import ApplicationCard from '../components/applications/ApplicationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const Applications = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { applications, isLoading, isError, message } = useSelector(
    (state) => state.applications
  );
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');
  const [interviewData, setInterviewData] = useState({
    applicationId: null,
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [showInterviewModal, setShowInterviewModal] = useState(false);  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.role) {
          return;
        }

        await dispatch(fetchApplications({ 
          type: user.role === 'employer' ? (jobId ? 'job' : 'received') : 'jobseeker',
          jobId 
        })).unwrap();
      } catch (error) {
        toast.error(error || 'Failed to fetch applications');
      }
    };

    fetchData();
  }, [dispatch, user?.role, jobId]);

  // Debug log for current state
  // console.log('Current applications state:', { applications, isLoading, isError, message });

  const handleWithdraw = async (applicationId) => {
    try {
      await dispatch(withdrawApplication(applicationId)).unwrap();
      toast.success('Application withdrawn successfully');
    } catch (error) {
      toast.error(error || 'Failed to withdraw application');
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus({ applicationId, newStatus })).unwrap();
      toast.success('Application status updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update application status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(scheduleInterview({
        applicationId: interviewData.applicationId,
        interviewDetails: {
          date: interviewData.date,
          time: interviewData.time,
          location: interviewData.location,
          notes: interviewData.notes
        }
      })).unwrap();
      toast.success('Interview scheduled successfully');
      setShowInterviewModal(false);
    } catch (error) {
      toast.error(error || 'Failed to schedule interview');
    }
  };

  const openInterviewModal = (applicationId) => {
    setInterviewData({ ...interviewData, applicationId });
    setShowInterviewModal(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }  const filterApplications = () => {
    // Ensure applications is an array and has items
    const validApplications = Array.isArray(applications) ? applications : [];

    if (filter === 'all') {
      return validApplications;
    }

    return validApplications.filter(app => {
      if (!app) return false;
      const appStatus = app.status?.toLowerCase() || '';
      return appStatus === filter;
    });
  };

  const getStatusFilters = () => {
    const statuses = user.role === 'employer' 
      ? ['pending', 'accepted', 'rejected', 'interviewed']
      : ['pending', 'accepted', 'rejected', 'withdrawn'];
    
    return statuses.map(status => {
      const count = applications.filter(app => app.status === status).length;
      return (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`px-4 py-2 rounded-lg capitalize transition-colors ${
            filter === status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {status} ({count})
        </button>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {user.role === 'employer' 
            ? jobId 
              ? 'Job Applications'
              : 'All Received Applications'
            : 'My Applications'
          }
        </h1>
        <p className="text-gray-600">
          {user.role === 'employer'
            ? 'Manage and review job applications'
            : 'Track and manage your job applications'
          }
        </p>
      </div>
      
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({applications.length})
        </button>
        {getStatusFilters()}
      </div>      {/* Applications list */}
      {isError ? (
        <div className="text-red-500 text-center py-4 bg-red-50 rounded-lg">
          <p>{message}</p>
        </div>
      ) : isLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(applications) || applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-gray-800 text-xl font-semibold mb-2">
            {user.role === 'employer'
              ? 'No applications received yet'
              : 'No applications found'
            }
          </h3>
          <p className="text-gray-600">
            {user.role === 'employer'
              ? 'Applications for your job postings will appear here'
              : 'Start applying for jobs to see your applications here'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterApplications().map((application) => {
            // console.log('Rendering application:', application);
            return (
              <ApplicationCard
                key={application._id}
                application={application}
                userRole={user.role}
                onWithdraw={handleWithdraw}
                onStatusUpdate={handleStatusUpdate}
                onScheduleInterview={openInterviewModal}
              />
            );
          })}
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
            <form onSubmit={handleScheduleInterview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewData.date}
                    onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    required
                    value={interviewData.time}
                    onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={interviewData.location}
                    onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                    placeholder="Enter interview location or meeting link"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData({...interviewData, notes: e.target.value})}
                    placeholder="Additional information for the candidate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;