<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Job Rejected</title>
</head>
<body>
    <h2>Job Listing Update</h2>
    <p>We're sorry, but your job listing "<strong>{{ $jobListing->title }}</strong>" has been rejected.</p>
    @if($reason)
        <p><strong>Reason:</strong> {{ $reason }}</p>
    @endif
    <p>Please review our job posting guidelines and try again.</p>
    <p>Best regards,<br>The {{ config('app.name') }} Team</p>
</body>
</html>
