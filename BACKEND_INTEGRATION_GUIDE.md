# Vault CRM - Backend Integration Guide for Supabase

**Last Updated:** October 6, 2025
**Target Completion:** Before Tuesday Demo
**Status:** Frontend Production-Ready ✅ | Backend Integration Pending ⏳

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema](#database-schema)
4. [Storage Configuration](#storage-configuration)
5. [Environment Variables](#environment-variables)
6. [API Routes to Implement](#api-routes-to-implement)
7. [Testing Checklist](#testing-checklist)
8. [Known Frontend Endpoints](#known-frontend-endpoints)

---

## Overview

The Vault CRM frontend is production-ready and running on `localhost:3005`. All TypeScript errors and ESLint warnings have been fixed. The backend integration requires:

1. **Supabase project creation**
2. **Database schema deployment**
3. **Storage bucket configuration**
4. **Content upload API implementation**
5. **Environment variable configuration**

**Time Estimate:** 2-3 hours for full backend setup

---

## Supabase Project Setup

### Step 1: Create New Project

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in details:
   - **Organization:** Select existing or create "VaultCRM"
   - **Project Name:** `vault-crm` or `onlyfans-crm`
   - **Database Password:** Generate strong password **SAVE THIS!**
   - **Region:** US East (North Virginia) or closest region
   - **Pricing Plan:** Free (for development)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Get API Credentials

1. Navigate to: **Project Settings** (⚙️) → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...` (starts with eyJ)

---

## Database Schema

### Content Table (Primary Feature)

Run this SQL in **SQL Editor** → **New Query**:

```sql
-- ============================================================
-- CONTENT TABLE - For photo/video uploads
-- ============================================================
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size BIGINT,
  category TEXT NOT NULL CHECK (category IN ('photos', 'videos', 'stories', 'ppv', 'all')),
  caption TEXT,
  status TEXT DEFAULT 'ready' CHECK (status IN ('draft', 'ready')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access"
  ON content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own content"
  ON content FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can delete own content"
  ON content FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Indexes for performance
CREATE INDEX idx_content_creator_id ON content(creator_id);
CREATE INDEX idx_content_created_at ON content(created_at DESC);
CREATE INDEX idx_content_category ON content(category);
CREATE INDEX idx_content_file_type ON content(file_type);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Storage Configuration

### Step 1: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Configure:
   - **Name:** `content-uploads`
   - **Public bucket:** Toggle **ON** ✅
   - **File size limit:** 100 MB
   - **Allowed MIME types:** Leave blank (or specify: `image/*, video/*`)
4. Click **"Create bucket"**

### Step 2: Set Storage Policies

Go to **Storage** → `content-uploads` → **Policies** → **New policy**

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'content-uploads' );
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'content-uploads' );
```

**Policy 3: Users Can Delete Own Uploads**
```sql
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'content-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Environment Variables

### Update `.env.local`

Replace placeholder values with real credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here

# Application Configuration
NEXT_PUBLIC_APP_NAME=VaultCRM
NEXT_PUBLIC_APP_URL=http://localhost:3005

# Feature Flags
NEXT_PUBLIC_ENABLE_SIGNUP=false
NEXT_PUBLIC_ENABLE_ONLYFANS_SYNC=false
```

**⚠️ Important:** After updating `.env.local`, **restart the dev server**:

```bash
# Kill the current server (Ctrl+C)
npm run dev -- -p 3005
```

---

## API Routes to Implement

### 1. Content Upload API

**File:** `src/app/api/content/upload/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string;
    const caption = formData.get('caption') as string;
    const status = formData.get('status') as string || 'ready';

    const uploadedContent = [];

    // Upload each file
    for (const file of files) {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('content-uploads')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-uploads')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { data: contentData, error: dbError } = await supabase
        .from('content')
        .insert({
          creator_id: user.id,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type.startsWith('image/') ? 'image' : 'video',
          file_size: file.size,
          category: category || 'all',
          caption: caption || null,
          status: status
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        continue;
      }

      uploadedContent.push(contentData);
    }

    return NextResponse.json({
      success: true,
      data: uploadedContent,
      count: uploadedContent.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error },
      { status: 500 }
    );
  }
}
```

### 2. Content Library Fetch API

**File:** `src/app/api/content/list/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category');
  const fileType = searchParams.get('fileType');

  try {
    let query = supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (fileType && fileType !== 'all') {
      query = query.eq('file_type', fileType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
```

---

## Frontend Integration Points

### Files That Need Backend Connection:

#### 1. **Content Upload Component**
**File:** `src/app/(dashboard)/content/page.tsx`

**Current status:** Upload button exists but has no `onClick` handler (line 320-324)

**What to add:**
```typescript
// Around line 264 (in the upload section)
const handleUpload = async () => {
  if (uploadedFiles.length === 0) return;

  const formData = new FormData();
  uploadedFiles.forEach(file => {
    formData.append('files', file.file);
  });
  formData.append('category', category);
  formData.append('caption', contentDescription);
  formData.append('status', 'ready'); // or get from state

  try {
    const response = await fetch('/api/content/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      // Show success message
      // Clear form
      setUploadedFiles([]);
      setContentDescription('');
      // Refresh content library
    }
  } catch (error) {
    console.error('Upload failed:', error);
    // Show error message
  }
};
```

**Then update the upload button (line 320):**
```typescript
<button
  onClick={handleUpload}  // ADD THIS
  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
>
  Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'File' : 'Files'}
</button>
```

#### 2. **Content Library Display**
**File:** `src/app/(dashboard)/content/page.tsx` (lines 331-360)

**Current status:** Shows empty state

**What to add:**
```typescript
// Add state for content library
const [libraryContent, setLibraryContent] = useState([]);
const [loading, setLoading] = useState(true);

// Fetch content on mount
useEffect(() => {
  fetchContent();
}, []);

const fetchContent = async () => {
  try {
    const response = await fetch('/api/content/list');
    const result = await response.json();
    if (result.success) {
      setLibraryContent(result.data);
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## Testing Checklist

### Backend Setup Verification

- [ ] Supabase project created
- [ ] Database password saved securely
- [ ] API credentials copied to `.env.local`
- [ ] Content table created via SQL Editor
- [ ] Storage bucket `content-uploads` created
- [ ] Storage policies configured
- [ ] Dev server restarted after env update

### Upload Functionality

- [ ] Navigate to http://localhost:3005/content
- [ ] Select "Photos" category
- [ ] Add caption: "Test upload"
- [ ] Upload 1 photo (JPG/PNG)
- [ ] Upload 1 video (MP4/MOV)
- [ ] Verify uploads appear in Supabase Storage
- [ ] Verify metadata in `content` table
- [ ] Check Content Library displays uploaded items
- [ ] Verify correct dates showing
- [ ] Filter by category (Photos/Videos)

### Database Verification

```sql
-- Check if uploads are saving
SELECT * FROM content ORDER BY created_at DESC LIMIT 10;

-- Check file storage
SELECT * FROM storage.objects WHERE bucket_id = 'content-uploads';

-- Verify indexes exist
SELECT indexname FROM pg_indexes WHERE tablename = 'content';
```

---

## Troubleshooting

### Common Issues

**1. "Unauthorized" error on upload**
- Check if user is authenticated
- Verify RLS policies are correct
- Confirm `creator_id` matches `auth.uid()`

**2. Storage upload fails**
- Verify bucket name is `content-uploads`
- Check file size < 100MB
- Ensure storage policies allow INSERT

**3. Content not displaying**
- Check browser console for errors
- Verify API route is returning data
- Check if `publicUrl` is accessible

**4. Environment variables not working**
- Restart dev server after changes
- Verify no typos in variable names
- Check `.env.local` is in project root

---

## Priority Order for Tuesday Demo

1. **✅ CRITICAL** - Content upload working (photos + videos)
2. **✅ CRITICAL** - Content library displaying with correct dates
3. **🟡 NICE-TO-HAVE** - Filter by category working
4. **🟢 OPTIONAL** - Delete content functionality

---

## Additional Backend Features (Future)

These are **NOT required** for Tuesday demo but good to know:

- Authentication system (login/signup)
- User profiles
- Creators table integration
- Fans table integration
- Revenue tracking
- Real-time updates via Supabase Realtime

---

## Questions? Issues?

If you encounter any issues:

1. Check Supabase logs: **Database** → **Logs**
2. Check Storage logs: **Storage** → **Logs**
3. Review browser console errors
4. Verify all SQL ran successfully

**Frontend is ready. Backend just needs Supabase connection! 🚀**
