<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavedJobSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = User::where('role', 'candidate')->get();
        $jobs = JobListing::all();

        $savedJobs = [
            ['candidate_index' => 0, 'job_index' => 0],
            ['candidate_index' => 0, 'job_index' => 1],
            ['candidate_index' => 1, 'job_index' => 2],
        ];

        foreach ($savedJobs as $saved) {
            SavedJob::create([
                'candidate_id' => $candidates[$saved['candidate_index']]->id,
                'job_listing_id' => $jobs[$saved['job_index']]->id,
            ]);
        }
    }
}
