import React from 'react';
import { Field } from 'formik';
import { FaBriefcase, FaBuilding } from 'react-icons/fa';
import { FormSection } from '../profile/FormSection';

export const BasicJobInfo = ({ errors, touched }) => (
    <FormSection title="Basic Job Information" icon={FaBriefcase}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Job Title
                </label>
                <Field
                    name="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Senior Software Engineer"
                />
                {errors.title && touched.title && (
                    <div className="text-red-600 text-sm mt-1">{errors.title}</div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Job Description
                </label>
                <Field
                    as="textarea"
                    name="description"
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                />
                {errors.description && touched.description && (
                    <div className="text-red-600 text-sm mt-1">{errors.description}</div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Employment Type
                    </label>
                    <Field
                        as="select"
                        name="employmentType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select type</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                        <option value="internship">Internship</option>
                    </Field>
                    {errors.employmentType && touched.employmentType && (
                        <div className="text-red-600 text-sm mt-1">{errors.employmentType}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Workplace Type
                    </label>
                    <Field
                        as="select"
                        name="workplaceType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select type</option>
                        <option value="remote">Remote</option>
                        <option value="on-site">On-site</option>
                        <option value="hybrid">Hybrid</option>
                    </Field>
                    {errors.workplaceType && touched.workplaceType && (
                        <div className="text-red-600 text-sm mt-1">{errors.workplaceType}</div>
                    )}
                </div>
            </div>
        </div>
    </FormSection>
);

export const RequirementsSection = ({ values }) => (
    <FormSection title="Requirements" icon={FaBuilding}>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Required Skills
                </label>
                <Field
                    as="textarea"
                    name="requirements.skills"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter skills separated by commas (e.g., React, Node.js, MongoDB)"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Minimum Experience (years)
                    </label>
                    <Field
                        type="number"
                        name="requirements.experience.minimum"
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Preferred Experience (years)
                    </label>
                    <Field
                        type="number"
                        name="requirements.experience.preferred"
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Education Level
                    </label>
                    <Field
                        as="select"
                        name="requirements.education.level"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select level</option>
                        <option value="high-school">High School</option>
                        <option value="associate">Associate Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="doctorate">Doctorate</option>
                    </Field>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Field of Study
                    </label>
                    <Field
                        name="requirements.education.field"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g., Computer Science"
                    />
                </div>
            </div>
        </div>
    </FormSection>
);
