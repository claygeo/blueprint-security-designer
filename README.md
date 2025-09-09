# Security Blueprint System

A React web application designed for security planning and equipment management, integrated with Supabase for robust data storage. This app enables users to upload facility floor plans, place security equipment markers, define room zones, and manage multiple blueprints with an interactive dashboard.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Database Setup](#database-setup)
- [Visuals](#visuals)
- [Notes](#notes)

## Features

- **User Authentication**: Secure registration and login system with protected routes
- **Blueprint Management**: Upload, save, edit, and delete facility floor plans
- **Interactive Equipment Placement**: Drag-and-drop placement of security equipment including:
  - Cameras (Dome, PTZ, Fixed, IR)
  - Sensors (Motion, Door, Window, Glass)
  - Access Control (Card Reader, Keypad, Biometric, Intercom)
  - Safety Equipment (Fire Alarm, Emergency Button, Smoke Detector, Sprinkler)
- **Room Zone Definition**: Draw and label interactive room zones on blueprints
- **Real-Time Dashboard**: View and manage all saved blueprints with search and filtering
- **Interactive Blueprint Viewer**: Click room zones to view contained security equipment
- **Cloud Storage**: Persistent storage of blueprints and images via Supabase
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

## Prerequisites

Before setting up the project, ensure you have the following:
- **Node.js and npm**: Install from [nodejs.org](https://nodejs.org)
- **Supabase Account**: Sign up at [supabase.com](https://supabase.com) and create a project
- **Environment Variables**: Obtain `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings
- **Git**: For cloning the repository

## Setup

Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/security-blueprint-system.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd security-blueprint-system
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   - Create a `.env` file in the project root
   - Add the following:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Update Supabase Configuration**:
   - Replace the hardcoded values in `src/supabaseClient.js` with environment variables:
   ```javascript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   ```

6. **Run the Development Server**:
   ```bash
   npm run dev
   ```

7. **Build for Production**:
   ```bash
   npm run build
   ```

## Database Setup

To configure the Supabase database, you need to create the necessary tables and set up storage. Copy and paste the following SQL code into the Supabase SQL Editor (found in your Supabase dashboard under SQL Editor):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blueprints table
CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    rooms JSONB DEFAULT '[]',
    equipment JSONB DEFAULT '[]',
    show_room_labels BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- Create policies for blueprints table
CREATE POLICY "Users can view own blueprints" ON blueprints
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blueprints" ON blueprints
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blueprints" ON blueprints
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blueprints" ON blueprints
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for blueprint images
INSERT INTO storage.buckets (id, name, public) VALUES ('blueprints', 'blueprints', true);

-- Create storage policies
CREATE POLICY "Users can upload blueprint images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'blueprints' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view blueprint images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blueprints');

CREATE POLICY "Users can update own blueprint images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'blueprints' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own blueprint images" ON storage.objects
    FOR DELETE USING (bucket_id = 'blueprints' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Visuals

The application features a modern, intuitive interface with the following key screens:

- **Dashboard**: Central hub showing saved blueprints and system features
- **Blueprint Editor**: Interactive canvas for placing equipment and defining zones
- **Interactive Viewer**: Click-to-explore interface for viewing blueprint details
- **Authentication**: Clean login and registration forms

*Screenshots and demo GIFs to be added. soonTM*

## Notes

- **Security**: Ensure environment variables are properly configured and never commit sensitive credentials to version control
- **Storage**: Blueprint images are automatically stored in Supabase Storage with user-specific folder organization
- **Equipment Types**: The system supports four main categories of security equipment, each with specific subtypes
- **Room Zones**: Interactive room zones can be drawn, labeled, and clicked to view contained equipment
- **Responsive Design**: The interface adapts to different screen sizes for optimal user experience
- **Data Persistence**: All blueprint data is automatically saved to Supabase with real-time synchronization
