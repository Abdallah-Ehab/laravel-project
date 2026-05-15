<?php

namespace App\Mail;

use App\Models\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public JobListing $jobListing,
        public string $reason = ''
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Job Listing Has Been Rejected',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.job-rejected',
        );
    }
}
