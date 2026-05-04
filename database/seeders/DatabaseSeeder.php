<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@jobboard.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->call([
            CategorySeeder::class,
            UserSeeder::class,
            JobListingSeeder::class,
            ApplicationSeeder::class,
            SavedJobSeeder::class,
        ]);
    }
}
