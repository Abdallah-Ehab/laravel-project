<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = User::where('role', 'candidate')->get();
        $jobs = JobListing::all();

        $applications = [
            [
                'cover_note' => 'Hi! I am very excited about this opportunity. I have 5 years of Laravel experience and have built several large-scale applications. I would love to bring my skills to your team.',
                'status' => 'pending',
            ],
            [
                'cover_note' => 'I have been following your company for a while and would be thrilled to join the team. My experience with React and TypeScript aligns perfectly with your requirements.',
                'status' => 'accepted',
            ],
            [
                'cover_note' => 'I am passionate about creating great user experiences and believe my background in both design and development makes me a strong fit for this role.',
                'status' => 'rejected',
            ],
        ];

        foreach ($applications as $index => $app) {
            Application::create(array_merge($app, [
                'job_listing_id' => $jobs[$index % $jobs->count()]->id,
                'candidate_id' => $candidates[$index % $candidates->count()]->id,
                'resume_path' => 'resumes/sample_resume_' . ($index + 1) . '.pdf',
            ]));
        }
    }
}
