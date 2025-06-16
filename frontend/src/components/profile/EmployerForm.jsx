import React from 'react';
import { Form, Field, FieldArray } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

const EmployerForm = ({ errors, touched, values, isSubmitting }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Form className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Basic Company Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name *</label>
              <Field
                name="companyName"
                type="text"
                className={`mt-1 block w-full rounded-md ${
                  errors.companyName && touched.companyName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                } shadow-sm`}
              />
              {errors.companyName && touched.companyName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.companyName}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Industry *</label>
              <Field
                name="industry"
                type="text"
                className={`mt-1 block w-full rounded-md ${
                  errors.industry && touched.industry
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                } shadow-sm`}
              />
              {errors.industry && touched.industry && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.industry}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company Size *</label>
              <Field
                as="select"
                name="companySize"
                className={`mt-1 block w-full rounded-md ${
                  errors.companySize && touched.companySize
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                } shadow-sm`}
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </Field>
              {errors.companySize && touched.companySize && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.companySize}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <Field
                name="website"
                type="url"
                placeholder="https://www.example.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Description *</label>
            <Field
              name="companyDescription"
              as="textarea"
              rows={4}
              className={`mt-1 block w-full rounded-md ${
                errors.companyDescription && touched.companyDescription
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } shadow-sm`}
            />
            {errors.companyDescription && touched.companyDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.companyDescription}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Location Information */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Field
                name="location.address"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <Field
                name="location.city"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <Field
                name="location.state"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <Field
                name="location.country"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <Field
                name="location.zipCode"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Social Media</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <Field
                name="socialMedia.linkedin"
                type="url"
                placeholder="https://linkedin.com/company/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <Field
                name="socialMedia.twitter"
                type="url"
                placeholder="https://twitter.com/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <Field
                name="socialMedia.facebook"
                type="url"
                placeholder="https://facebook.com/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Workplace Features */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Workplace Features</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Remote Work Policy</label>
            <Field
              as="select"
              name="workplaceFeatures.remoteWorkPolicy"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select remote work policy</option>
              <option value="remote-only">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="flexible">Flexible</option>
              <option value="on-site">On-site</option>
            </Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Inclusivity Programs</label>
            <FieldArray name="inclusivityPrograms">
              {({ remove, push }) => (
                <div className="space-y-4">
                  {values.inclusivityPrograms?.map((program, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Field
                        as="select"
                        name={`inclusivityPrograms.${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="">Select a program</option>
                        <option value="disability-friendly">Disability Friendly</option>
                        <option value="veteran-program">Veteran Program</option>
                        <option value="return-to-work">Return to Work</option>
                        <option value="retirement-transition">Retirement Transition</option>
                      </Field>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                  <motion.button
                    type="button"
                    onClick={() => push('')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Program
                  </motion.button>
                </div>
              )}
            </FieldArray>
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

export default EmployerForm;
