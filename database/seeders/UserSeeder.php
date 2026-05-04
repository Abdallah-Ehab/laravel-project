<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $employers = [
            [
                'name' => 'John Smith',
                'email' => 'john@acmecorp.test',
                'role' => 'employer',
                'bio' => 'HR Director at Acme Corp. Building great teams since 2015.',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@techstart.test',
                'role' => 'employer',
                'bio' => 'CTO & Co-founder at TechStart. Passionate about remote-first engineering.',
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael@designhub.test',
                'role' => 'employer',
                'bio' => 'Head of Talent at DesignHub. Connecting creatives with dream jobs.',
            ],
        ];

        foreach ($employers as $employer) {
            User::create(array_merge($employer, [
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]));
        }

        $candidates = [
            [
                'name' => 'Emily Davis',
                'email' => 'emily@example.test',
                'role' => 'candidate',
                'bio' => 'Full-stack developer with 5 years of experience in Laravel and React.',
            ],
            [
                'name' => 'James Wilson',
                'email' => 'james@example.test',
                'role' => 'candidate',
                'bio' => 'UX designer turned frontend developer. Love building beautiful interfaces.',
            ],
            [
                'name' => 'Olivia Martinez',
                'email' => 'olivia@example.test',
                'role' => 'candidate',
                'bio' => 'Data scientist with expertise in ML, Python, and cloud infrastructure.',
            ],
        ];

        foreach ($candidates as $candidate) {
            User::create(array_merge($candidate, [
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]));
        }
    }
}
