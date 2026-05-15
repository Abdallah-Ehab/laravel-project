<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Application Status Update</title>
</head>
<body>
    <h2>Application Status Update</h2>
    <p>Your application for "<strong>{{ $application->jobListing->title }}</strong>" at {{ $application->jobListing->company_name }} has been <strong>{{ $application->status }}</strong>.</p>
    @if($application->status === 'accepted')
        <p>The employer will be in touch with you soon regarding next steps.</p>
    @endif
    <p>Best regards,<br>The {{ config('app.name') }} Team</p>
</body>
</html>
