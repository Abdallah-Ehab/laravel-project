<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobListingSeeder extends Seeder
{
    public function run(): void
    {
        $employers = User::where('role', 'employer')->get();
        $categories = Category::all();

        $jobs = [
            [
                'title' => 'Senior Laravel Developer',
                'description' => 'We are looking for an experienced Laravel developer to join our engineering team. You will be responsible for building and maintaining our core platform, working closely with product and design teams to deliver high-quality features.',
                'requirements' => '5+ years of PHP experience\n3+ years of Laravel experience\nStrong understanding of REST APIs and microservices\nExperience with MySQL or PostgreSQL\nFamiliarity with testing frameworks (PHPUnit, Pest)',
                'benefits' => 'Competitive salary\nRemote-first culture\nAnnual learning budget\nHealth insurance\nFlexible PTO',
                'salary_min' => 80000,
                'salary_max' => 120000,
                'location' => 'Remote',
                'work_type' => 'remote',
                'experience_level' => 'senior',
                'deadline' => now()->addDays(30),
                'company_name' => 'Acme Corp',
                'status' => 'approved',
                'views' => 142,
            ],
            [
                'title' => 'React Frontend Engineer',
                'description' => 'Join our frontend team to build amazing user experiences using React, TypeScript, and modern tooling. You will collaborate with designers and backend engineers to ship features that delight our users.',
                'requirements' => '3+ years of React experience\nProficiency in TypeScript\nExperience with state management (Redux, Zustand, or similar)\nFamiliarity with testing (Jest, React Testing Library)\nStrong CSS/Tailwind skills',
                'benefits' => 'Competitive compensation\nStock options\nHome office stipend\nUnlimited PTO\nAnnual team retreats',
                'salary_min' => 70000,
                'salary_max' => 110000,
                'location' => 'San Francisco, CA',
                'work_type' => 'hybrid',
                'experience_level' => 'mid',
                'deadline' => now()->addDays(21),
                'company_name' => 'TechStart',
                'status' => 'approved',
                'views' => 98,
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'We need a talented UI/UX designer to help shape the look and feel of our products. You will conduct user research, create wireframes and prototypes, and work closely with developers to bring designs to life.',
                'requirements' => '4+ years of UI/UX design experience\nProficiency in Figma\nStrong portfolio showcasing web and mobile designs\nExperience with user research and usability testing\nExcellent communication skills',
                'benefits' => 'Creative freedom\nDesign tool budget\nFlexible hours\nRemote work options\nProfessional development',
                'salary_min' => 65000,
                'salary_max' => 95000,
                'location' => 'New York, NY',
                'work_type' => 'on-site',
                'experience_level' => 'mid',
                'deadline' => now()->addDays(14),
                'company_name' => 'DesignHub',
                'status' => 'approved',
                'views' => 67,
            ],
        ];

        foreach ($jobs as $index => $job) {
            JobListing::create(array_merge($job, [
                'slug' => Str::slug($job['title']),
                'employer_id' => $employers[$index % $employers->count()]->id,
                'category_id' => $categories->random()->id,
            ]));
        }
    }
}
