import React from 'react';
import { Field } from 'formik';
import { FaBuilding, FaGlobe } from 'react-icons/fa';
import { FormSection, FormField } from './FormSection';

export const CompanyInfoSection = ({ errors, touched }) => (
    <FormSection title="Company Information" icon={FaBuilding}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Company Name" error={errors.companyName} touched={touched.companyName}>
                <Field
                    name="companyName"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>

            <FormField label="Industry" error={errors.industry} touched={touched.industry}>
                <Field
                    name="industry"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>

            <FormField label="Company Size" error={errors.companySize} touched={touched.companySize}>
                <Field
                    as="select"
                    name="companySize"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                </Field>
            </FormField>

            <FormField label="Website" error={errors.website} touched={touched.website}>
                <Field
                    name="website"
                    type="url"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://example.com"
                />
            </FormField>
        </div>

        <FormField label="Company Description" error={errors.companyDescription} touched={touched.companyDescription}>
            <Field
                as="textarea"
                name="companyDescription"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </FormField>
    </FormSection>
);

export const LocationSection = ({ errors, touched }) => (
    <FormSection title="Location" icon={FaGlobe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Address">
                <Field
                    name="location.address"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>
            <FormField label="City">
                <Field
                    name="location.city"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>
            <FormField label="State/Province">
                <Field
                    name="location.state"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>
            <FormField label="Country">
                <Field
                    name="location.country"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>
            <FormField label="Zip/Postal Code">
                <Field
                    name="location.zipCode"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </FormField>
        </div>
    </FormSection>
);
