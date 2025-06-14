import create from 'zustand';
import axiosInstance from '../utils/axios';

const useApplicationStore = create((set, get) => ({
  applications: [],
  loading: false,
  error: null,

  fetchApplications: async (userRole) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        userRole === "employer"
          ? "/api/applications/received"
          : "/api/applications/me"
      );
      set({ applications: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching applications:", err);
      set({ 
        error: err.response?.data?.message || "Failed to fetch applications",
        loading: false 
      });
    }
  },

  updateApplicationStatus: async (applicationId, newStatus) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}`, {
        status: newStatus,
      });

      // Update the application status in the store
      set((state) => ({
        applications: state.applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        ),
      }));
      return true;
    } catch (err) {
      console.error("Error updating status:", err);
      set({ error: err.response?.data?.message || "Failed to update application status" });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useApplicationStore;
