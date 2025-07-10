# Medical Survey App

A modern community platform for sharing medical experiences, posting questions, and collecting survey data, powered by Next.js and Supabase.

## Features
- User authentication (register, login, password reset)
- User profiles with survey completion logic
- Dynamic survey questions
- Create, like, and comment on posts
- Real-time comments and like updates
- Image upload for posts
- Infinite scroll and pagination
- Responsive, modern UI
- Supabase Row Level Security (RLS) and storage

## Tech Stack
- Next.js (App Router, React 19+)
- Supabase (Database, Auth, Storage, Realtime)
- Tailwind CSS
- date-fns (date formatting)

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd medical-survey-app
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set up Supabase
- Create a new Supabase project.
- Run the SQL scripts in `/scripts` in order (01-create-tables.sql, 02-create-functions.sql, 03-fix-rls-policies.sql) using the Supabase SQL editor.
- (Optional) Add a `post-images` storage bucket for post images.

### 5. Start the development server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

## Usage
- Register and complete your profile (survey for female users).
- Create posts, like, and comment in real time.
- Upload images to posts.

## Folder Structure
- `app/` - Next.js app directory (pages, layouts, routes)
- `components/` - UI and shared components
- `contexts/` - React context providers (auth, language)
- `hooks/` - Custom React hooks (auth guard, real-time comments, etc.)
- `lib/` - Supabase client and utilities
- `scripts/` - SQL migration scripts for Supabase

## License
MIT 