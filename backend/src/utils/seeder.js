import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../model/User.js';
import JobSeeker from '../model/JobSeeker.js';
import Employer from '../model/Employer.js';
import Job from '../model/Job.js';

dotenv.config();

const users = [
    {
        email: 'jobseeker1@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'jobseeker',
        phone: '+1234567890'
    },
    {
        email: 'employer1@techcorp.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'employer',
        phone: '+1987654321'
    }
];

const jobSeekers = [
    {
        category: 'regular',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: [
            {
                title: 'Frontend Developer',
                company: 'Web Solutions Inc',
                location: 'New York',
                startDate: '2020-01-01',
                endDate: '2022-12-31',
                description: 'Developed responsive web applications using React',
                isCurrentRole: false
            }
        ],
        education: [
            {
                degree: 'Bachelor of Science',
                institution: 'Tech University',
                field: 'Computer Science',
                graduationYear: 2020
            }
        ],
        preferences: {
            remoteWork: true,
            flexibleSchedule: true,
            preferredLocations: ['New York', 'Remote'],
            expectedSalary: {
                min: 80000,
                max: 120000,
                currency: 'USD'
            }
        }
    }
];

const employers = [
    {
        companyName: 'Tech Corp Solutions',
        industry: 'Information Technology',
        companySize: '51-200',
        companyDescription: 'Leading tech company specializing in innovative solutions',
        website: 'https://techcorp.example.com',
        location: {
            address: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            zipCode: '94105'
        },
        socialMedia: {
            linkedin: 'https://linkedin.com/company/techcorp',
            twitter: '@techcorp'
        },
        inclusivityPrograms: ['disability-friendly', 'veteran-program'],
        workplaceFeatures: {
            remoteWorkPolicy: 'hybrid',
            flexibleHours: true,
            accessibilityFeatures: ['wheelchair-accessible', 'screen-reader-support']
        }
    }
];

const jobs = [
    {
        title: 'Senior Full Stack Developer',
        description: 'Looking for an experienced developer to join our team',
        requirements: {
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            experience: {
                minimum: 5,
                preferred: 7
            },
            education: {
                level: "Bachelor's Degree",
                field: 'Computer Science'
            }
        },
        employmentType: 'full-time',
        workplaceType: 'hybrid',
        location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            remote: true
        },
        salary: {
            min: 120000,
            max: 180000,
            currency: 'USD',
            isNegotiable: true
        },
        benefits: [
            'Health Insurance',
            '401(k)',
            'Stock Options',
            'Flexible Hours'
        ],
        flexibleSchedule: true,
        accommodations: {
            available: true,
            description: 'We provide reasonable accommodations for qualified individuals with disabilities'
        },
        status: 'published'
    }
];

const seedData = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany();
        await JobSeeker.deleteMany();
        await Employer.deleteMany();
        await Job.deleteMany();
        console.log('Cleared existing data');

        // Create users
        const createdUsers = await User.create(users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        })));
        console.log('Users created');

        // Create job seeker profile
        const jobSeeker = createdUsers.find(user => user.role === 'jobseeker');
        if (jobSeeker) {
            await JobSeeker.create({
                ...jobSeekers[0],
                user: jobSeeker._id
            });
        }
        console.log('JobSeeker profile created');

        // Create employer profile and job
        const employer = createdUsers.find(user => user.role === 'employer');
        if (employer) {
            const createdEmployer = await Employer.create({
                ...employers[0],
                user: employer._id
            });

            await Job.create({
                ...jobs[0],
                employer: createdEmployer._id,
                publishedAt: new Date()
            });
        }
        console.log('Employer profile and job created');

        console.log('Data seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
