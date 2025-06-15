import React from 'react';

export const FormSection = ({ title, icon: Icon, children }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {title && (
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    {Icon && <Icon />}
                    {title}
                </h3>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export const FormField = ({ label, error, touched, children }) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="mt-1">
                {children}
            </div>
            {error && touched && (
                <div className="text-red-600 text-sm mt-1">{error}</div>
            )}
        </div>
    );
};
