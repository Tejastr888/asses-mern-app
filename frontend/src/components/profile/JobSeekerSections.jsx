import React from 'react';
import { Field, FieldArray } from 'formik';
import { FaBriefcase, FaGraduationCap, FaClock, FaWheelchair } from 'react-icons/fa';
import { MdWork, MdLocationOn, MdAttachMoney } from 'react-icons/md';
import { FormSection, FormField } from './FormSection';

export const BasicInfoSection = ({ errors, touched }) => (
    <FormSection title="Basic Information" icon={FaBriefcase}>
        <FormField label="Category" error={errors.category} touched={touched.category}>
            <Field
                as="select"
                name="category"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
                <option value="regular">Regular</option>
                <option value="career-break-returner">Career Break Returner</option>
                <option value="disabled">Person with Disability</option>
                <option value="veteran">Veteran</option>
                <option value="retiree">Retiree</option>
            </Field>
        </FormField>

        <FormField label="Skills" error={errors.skills} touched={touched.skills}>
            <Field
                name="skills"
                as="textarea"
                placeholder="Enter skills separated by commas"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </FormField>
    </FormSection>
);

export const ExperienceSection = ({ values }) => (
    <FormSection title="Experience" icon={MdWork}>
        <FieldArray name="experience">
            {({ push, remove }) => (
                <div className="space-y-4">
                    {values.experience.map((_, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Title">
                                    <Field
                                        name={`experience.${index}.title`}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </FormField>
                                <FormField label="Company">
                                    <Field
                                        name={`experience.${index}.company`}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </FormField>
                                {/* ... other experience fields ... */}
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Remove Experience
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => push({
                            title: '',
                            company: '',
                            location: '',
                            startDate: '',
                            endDate: '',
                            description: '',
                            isCurrentRole: false
                        })}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                        Add Experience
                    </button>
                </div>
            )}
        </FieldArray>
    </FormSection>
);

export const EducationSection = ({ values }) => (
    <FormSection title="Education" icon={FaGraduationCap}>
        <FieldArray name="education">
            {({ push, remove }) => (
                /* Similar structure to Experience section */
                <div>...</div>
            )}
        </FieldArray>
    </FormSection>
);

// Export other sections similarly
