import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import JobSeekerForm from '../components/profile/JobSeekerForm';
import EmployerForm from '../components/profile/EmployerForm';
import { JobSeekerSchema, EmployerSchema } from '../components/profile/validationSchemas';
import { fetchProfile, saveProfile, resetSaveStatus } from '../features/profile/profileSlice';

const LoadingSpinner = () => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: profile, status, error, saveStatus, saveError } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile(user.role));
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Reset save status after 3 seconds of success
    if (saveStatus === 'succeeded') {
      const timer = setTimeout(() => {
        dispatch(resetSaveStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(
      saveProfile({
        values,
        role: user.role,
        isNewProfile: !profile,
      })
    );
    setSubmitting(false);
  };

  const getInitialValues = () => {
    if (profile) return profile;

    return user?.role === 'employer'
      ? {
          companyName: '',
          industry: '',
          companySize: '',
          companyDescription: '',
          website: '',
          location: {
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
          workplaceFeatures: {
            remoteWorkPolicy: '',
            flexibleHours: false,
            accessibilityFeatures: [],
          },
        }
      : {
          category: '',
          skills: [],
          experience: [],
          education: [],
          preferences: {
            remoteWork: false,
            flexibleSchedule: false,
            preferredLocations: '',
            expectedSalary: {
              min: '',
              max: '',
              currency: '',
            },
          },
        };
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="space-y-6">
        <div className="text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {user?.role === 'employer' ? 'Company Profile' : 'Professional Profile'}
          </motion.h1>
          <p className="mt-1 text-sm text-gray-500">
            {profile
              ? 'Update your profile information below'
              : 'Complete your profile to get started'}
          </p>
        </div>

        <AnimatePresence>
          {saveStatus === 'succeeded' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-md bg-green-50 p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Profile saved successfully
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {(error || saveError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-md bg-red-50 p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error ? 'Error loading profile' : 'Error saving profile'}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error || saveError}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-lg bg-white shadow"
        >
          <div className="px-4 py-5 sm:p-6">
            <Formik
              initialValues={getInitialValues()}
              validationSchema={user?.role === 'employer' ? EmployerSchema : JobSeekerSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formikProps) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {user?.role === 'employer' ? (
                    <EmployerForm {...formikProps} isSubmitting={saveStatus === 'loading'} />
                  ) : (
                    <JobSeekerForm {...formikProps} isSubmitting={saveStatus === 'loading'} />
                  )}
                </motion.div>
              )}
            </Formik>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
