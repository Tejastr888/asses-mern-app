import * as Yup from 'yup';

export const jobValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Job title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: Yup.string()
    .required('Job description is required')
    .min(50, 'Description must be at least 50 characters'),
  requirements: Yup.object().shape({
    skills: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one skill is required'),
    experience: Yup.object().shape({
      minimum: Yup.number()
        .min(0, 'Minimum experience cannot be negative')
        .required('Minimum experience is required'),
      preferred: Yup.number()
        .min(0, 'Preferred experience cannot be negative')
    }),
    education: Yup.object().shape({
      level: Yup.string().required('Education level is required'),
      field: Yup.string().required('Field of study is required')
    })
  }),
  employmentType: Yup.string()
    .required('Employment type is required')
    .oneOf(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
  workplaceType: Yup.string()
    .required('Workplace type is required')
    .oneOf(['remote', 'on-site', 'hybrid']),
  location: Yup.object().shape({
    city: Yup.string().when('workplaceType', {
      is: (val) => val !== 'remote',
      then: () => Yup.string().required('City is required'),
    }),
    state: Yup.string().when('workplaceType', {
      is: (val) => val !== 'remote',
      then: () => Yup.string().required('State is required'),
    }),
    country: Yup.string().required('Country is required'),
    remote: Yup.boolean()
  }),  salary: Yup.object().shape({
    min: Yup.number()
      .required('Minimum salary is required')
      .min(0, 'Salary cannot be negative'),
    max: Yup.number()
      .min(0, 'Salary cannot be negative')
      .test('max', 'Maximum salary must be greater than minimum salary', 
        function(value) {
          return !value || value >= this.parent.min;
        }),
    currency: Yup.string().default('USD')
  }),
  benefits: Yup.array().of(Yup.string()),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['draft', 'published', 'closed', 'paused'])
    .default('published'),
  flexibleSchedule: Yup.boolean().default(false)
});
