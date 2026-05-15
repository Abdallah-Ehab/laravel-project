<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Job Approved</title>
</head>
<body>
    <h2>Congratulations!</h2>
    <p>Your job listing "<strong>{{ $jobListing->title }}</strong>" has been approved and is now live on our job board.</p>
    <p>You can view and manage your listing <a href="{{ url('/jobs/' . $jobListing->slug) }}">here</a>.</p>
    <p>Best regards,<br>The {{ config('app.name') }} Team</p>
</body>
</html>
