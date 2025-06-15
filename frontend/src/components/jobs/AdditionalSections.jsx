import React from 'react';
import { Field, FieldArray } from 'formik';
import { MdLocationOn, MdAttachMoney } from 'react-icons/md';
import { FaWheelchair } from 'react-icons/fa';
import { FormSection } from '../profile/FormSection';

export const LocationAndSalarySection = ({ values, errors, touched }) => (
    <FormSection title="Location & Compensation" icon={MdLocationOn}>
        <div className="space-y-6">
            {values.workplaceType !== 'remote' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <Field
                            name="location.city"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <Field
                            name="location.state"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <Field
                            name="location.country"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Minimum Salary
                    </label>
                    <Field
                        type="number"
                        name="salary.min"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Maximum Salary
                    </label>
                    <Field
                        type="number"
                        name="salary.max"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Currency
                    </label>
                    <Field
                        as="select"
                        name="salary.currency"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                    </Field>
                </div>
            </div>

            <div>
                <label className="flex items-center">
                    <Field
                        type="checkbox"
                        name="salary.isNegotiable"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Salary is negotiable</span>
                </label>
            </div>
        </div>
    </FormSection>
);

export const BenefitsSection = ({ values }) => (
    <FormSection title="Benefits & Accommodations" icon={MdAttachMoney}>
        <div className="space-y-6">
            <FieldArray name="benefits">
                {({ push, remove }) => (
                    <div className="space-y-2">
                        {values.benefits.map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Field
                                    name={`benefits.${index}`}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="e.g., Health Insurance"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => push('')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                            Add Benefit
                        </button>
                    </div>
                )}
            </FieldArray>

            <div>
                <label className="flex items-center">
                    <Field
                        type="checkbox"
                        name="flexibleSchedule"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Flexible Schedule Available</span>
                </label>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="flex items-center">
                        <Field
                            type="checkbox"
                            name="accommodations.available"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Workplace Accommodations Available</span>
                    </label>
                </div>

                {values.accommodations.available && (
                    <div>
                        <Field
                            as="textarea"
                            name="accommodations.description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Describe available accommodations..."
                            rows={3}
                        />
                    </div>
                )}
            </div>
        </div>
    </FormSection>
);
