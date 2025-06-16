import React from 'react';
import { Form, Field, FieldArray } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

const JobSeekerForm = ({ errors, touched, values, isSubmitting }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Form className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Category Section */}
        <motion.div
          variants={itemVariants}
          className="sm:grid sm:grid-cols-3 sm:gap-4"
        >
          <label className="block text-sm font-medium text-gray-700 sm:pt-2">
            Category *
          </label>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <Field
              as="select"
              name="category"
              className={`block w-full rounded-md ${
                errors.category && touched.category
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } shadow-sm`}
            >
              <option value="">Select a category</option>
              <option value="regular">Regular</option>
              <option value="career-break-returner">Career Break Returner</option>
              <option value="disabled">Person with Disability</option>
              <option value="veteran">Veteran</option>
              <option value="retiree">Retiree</option>
            </Field>
            {errors.category && touched.category && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.category}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={itemVariants}>
          <FieldArray name="skills">
            {({ push, remove }) => (
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills *
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your professional skills
                  </p>
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="space-y-2">
                    {values.skills?.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2"
                      >
                        <Field
                          name={`skills.${index}`}
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter a skill"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push('')}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Skill
                    </button>
                  </div>
                  {errors.skills && touched.skills && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.skills}
                    </motion.p>
                  )}
                </div>
              </div>
            )}
          </FieldArray>
        </motion.div>

        {/* Experience Section */}
        <motion.div variants={itemVariants}>
          <FieldArray name="experience">
            {({ push, remove }) => (
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your work experience
                  </p>
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0 space-y-4">
                  <AnimatePresence>
                    {values.experience?.map((exp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border border-gray-200 p-4 shadow-sm"
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Job Title *
                              </label>
                              <Field
                                name={`experience.${index}.title`}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Company *
                              </label>
                              <Field
                                name={`experience.${index}.company`}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Start Date *
                              </label>
                              <Field
                                name={`experience.${index}.startDate`}
                                type="date"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            {!values.experience[index].isCurrentRole && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  End Date
                                </label>
                                <Field
                                  name={`experience.${index}.endDate`}
                                  type="date"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <Field
                              name={`experience.${index}.description`}
                              as="textarea"
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Field
                                type="checkbox"
                                name={`experience.${index}.isCurrentRole`}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-2 text-sm text-gray-700">
                                Current Role
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    type="button"
                    onClick={() =>
                      push({
                        title: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        isCurrentRole: false,
                      })
                    }
                    className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Experience
                  </motion.button>
                </div>
              </div>
            )}
          </FieldArray>
        </motion.div>

        {/* Education Section */}
        <motion.div variants={itemVariants}>
          <FieldArray name="education">
            {({ push, remove }) => (
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your educational background
                  </p>
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0 space-y-4">
                  <AnimatePresence>
                    {values.education?.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border border-gray-200 p-4 shadow-sm"
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Degree *
                              </label>
                              <Field
                                name={`education.${index}.degree`}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Institution *
                              </label>
                              <Field
                                name={`education.${index}.institution`}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Field of Study *
                              </label>
                              <Field
                                name={`education.${index}.field`}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Graduation Year *
                              </label>
                              <Field
                                name={`education.${index}.graduationYear`}
                                type="number"
                                min="1950"
                                max="2030"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    type="button"
                    onClick={() =>
                      push({
                        degree: '',
                        institution: '',
                        field: '',
                        graduationYear: '',
                      })
                    }
                    className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Education
                  </motion.button>
                </div>
              </div>
            )}
          </FieldArray>
        </motion.div>

        {/* Preferences Section */}
        <motion.div variants={itemVariants}>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferences
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Set your job preferences
              </p>
            </div>
            <div className="mt-1 sm:col-span-2 sm:mt-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="preferences.remoteWork"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Open to Remote Work
                  </label>
                </div>
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="preferences.flexibleSchedule"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Flexible Schedule
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Locations
                </label>
                <Field
                  name="preferences.preferredLocations"
                  type="text"
                  placeholder="Enter locations separated by commas"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expected Salary Range
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Field
                      name="preferences.expectedSalary.min"
                      type="number"
                      placeholder="Minimum"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <Field
                      name="preferences.expectedSalary.max"
                      type="number"
                      placeholder="Maximum"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <Field
                  name="preferences.expectedSalary.currency"
                  as="select"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </Field>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </Form>
  );
};

export default JobSeekerForm;
