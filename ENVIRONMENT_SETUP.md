# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI API Keys (At least one required for question generation)
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Other API Keys
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here

# Application URLs
NEXT_PUBLIC_HOST_URL=http://localhost:3000
```

## AI Service Fallback System

The application now includes a robust fallback system for AI question generation:

1. **Primary**: Google Gemini API (if `GEMINI_API_KEY` is provided)
2. **Fallback**: OpenRouter API (if `OPENROUTER_API_KEY` is provided)  
3. **Ultimate Fallback**: Static curated questions (always available)

### Benefits:
- ✅ Handles API overload errors (503 Service Unavailable)
- ✅ Automatic retry with exponential backoff
- ✅ Seamless fallback between services
- ✅ Always provides questions even if all AI services fail

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Replace the placeholder values in your `.env.local` file

## Database Setup

Make sure your Supabase database has a `Users` table with the following structure:

```sql
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  credits INTEGER DEFAULT 4,
  lastCreditReset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Interviews (
  id SERIAL PRIMARY KEY,
  interview_id VARCHAR UNIQUE NOT NULL,
  userEmail VARCHAR,
  questionList JSON,
  jobPosition VARCHAR,
  jobDescription VARCHAR,
  duration VARCHAR,
  type VARCHAR,
  candidateName VARCHAR,
  candidateEmail VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE EmailLogs (
  id SERIAL PRIMARY KEY,
  candidate_email VARCHAR NOT NULL,
  candidate_name VARCHAR,
  interview_id VARCHAR,
  job_position VARCHAR,
  email_content JSON,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR DEFAULT 'sent'
);
```

## Credit System

The application includes a comprehensive credit management system:

### Features:
- ✅ **4 Interview Credits** per user initially
- ✅ **Monthly Reset** - Credits restore to 4 every month
- ✅ **Visual Indicator** - Lightning bolt icon with credit count
- ✅ **Automatic Validation** - Prevents interview creation without credits
- ✅ **Real-time Updates** - Credits update immediately after use

### Credit Display:
- **Header**: Shows current credit count with lightning bolt icon
- **Dropdown**: Detailed credit information with reset date
- **Validation**: Blocks interview creation when credits = 0
- **Notifications**: Success message when credits reset monthly

## Email Functionality

The application automatically sends interview feedback to candidates via email:

### Features:
- ✅ **Automatic Email Sending** - Feedback sent after interview completion
- ✅ **Candidate Information** - Captures name and email during interview creation
- ✅ **Professional Email Templates** - HTML and text versions
- ✅ **Email Logging** - All emails stored in database for tracking
- ✅ **Error Handling** - Graceful fallback if email fails

### Email Process:
1. **Interview Creation**: User enters candidate name and email
2. **Interview Completion**: AI generates feedback
3. **Email Sending**: Feedback automatically sent to candidate
4. **Logging**: Email details stored in EmailLogs table

## Troubleshooting

### "Failed to fetch" Error
This error occurs when Supabase environment variables are missing or incorrect. Check:
- ✅ `.env.local` file exists in project root
- ✅ `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- ✅ Restart your development server after adding environment variables

### Network Connectivity Issues
The app includes automatic retry mechanisms for network issues. If problems persist:
- Check your internet connection
- Verify Supabase service status
- Check browser console for detailed error messages
