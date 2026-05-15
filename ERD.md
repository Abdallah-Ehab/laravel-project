# Database ERD

```mermaid
erDiagram
    users {
        bigint id PK
        varchar name
        varchar email UK
        timestamp email_verified_at NULL
        varchar password
        enum role "employer | candidate | admin"
        varchar avatar NULL
        text bio NULL
        timestamp banned_at NULL
        timestamp created_at
        timestamp updated_at
    }

    categories {
        bigint id PK
        varchar name
        varchar slug UK
        timestamp created_at
        timestamp updated_at
    }

    job_listings {
        bigint id PK
        bigint employer_id FK
        bigint category_id FK NULL
        varchar title
        varchar slug UK
        longtext description
        text requirements
        text benefits NULL
        unsigned_int salary_min NULL
        unsigned_int salary_max NULL
        varchar location
        enum work_type "remote | on-site | hybrid"
        enum experience_level "junior | mid | senior | any"
        date deadline NULL
        varchar company_name
        varchar company_logo NULL
        enum status "pending | approved | rejected"
        unsigned_int views
        timestamp created_at
        timestamp updated_at
    }

    applications {
        bigint id PK
        bigint job_listing_id FK
        bigint candidate_id FK
        varchar resume_path
        text cover_note NULL
        enum status "pending | accepted | rejected"
        timestamp created_at
        timestamp updated_at
    }

    saved_jobs {
        bigint id PK
        bigint candidate_id FK
        bigint job_listing_id FK
        timestamp created_at
        timestamp updated_at
    }

    password_reset_tokens {
        varchar email PK
        varchar token
        timestamp created_at NULL
    }

    sessions {
        varchar id PK
        bigint user_id FK NULL
        varchar ip_address NULL
        text user_agent NULL
        longtext payload
        int last_activity
    }

    %% ── Relationships ──

    users ||--o{ job_listings : "posts (as employer)"
    categories ||--o{ job_listings : "contains"
    users ||--o{ applications : "submits (as candidate)"
    job_listings ||--o{ applications : "receives"
    users ||--o| applications : "" does NOT apply
    users ||--o{ saved_jobs : "saves (as candidate)"
    job_listings ||--o{ saved_jobs : "saved by"
    users ||--o{ sessions : "browser sessions"
```

## Notes

| Table | Notes |
|-------|-------|
| **users** | Role enum defaults to `candidate`. `banned_at` is a nullable timestamp — non-null means banned. |
| **job_listings** | `category_id` is nullable with `ON DELETE SET NULL`. `status` defaults to `pending`. |
| **applications** | Unique composite index on `(job_listing_id, candidate_id)` — one application per job per candidate. `status` defaults to `pending`. |
| **saved_jobs** | Pivot table with a unique composite index on `(candidate_id, job_listing_id)`. Allows many-to-many between `users` (candidates) and `job_listings`. |
| **password_reset_tokens** | Laravel auth scaffold table — email is the primary key. |
| **categories** | Has a unique `slug` for URL-friendly category routing. |
