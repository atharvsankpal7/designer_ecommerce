# Contact & Social Media Management System

## Overview
This system provides comprehensive management for contact information, social media links, and footer links through an admin interface. The contact page is now fully SSR (Server-Side Rendered) and dynamically pulls data from the database.

## Features Implemented

### 1. Contact Settings Management
- **Admin Page**: `/admin/contact-settings`
- **Features**:
  - Edit phone number, email, and address
  - Manage working hours for each day of the week
  - Update Google Maps embed URL
  - All changes are immediately reflected on the contact page

### 2. Social Media Management
- **Admin Page**: `/admin/social-media`
- **Features**:
  - Add unlimited social media links
  - Choose from predefined icons (Facebook, Instagram, Twitter, YouTube, LinkedIn, Website)
  - Set custom colors for each social media link
  - Drag and drop reordering
  - Toggle visibility in footer and contact page separately
  - Enable/disable individual links
  - Real-time preview of changes

### 3. Footer Links Management
- **Admin Page**: `/admin/footer-links`
- **Features**:
  - Manage links in three categories: Quick Links, Categories, Legal
  - Add/edit/delete footer links
  - Toggle link visibility
  - Organized by category tabs
  - All changes reflect immediately in the footer

### 4. Dynamic Footer Component
- **Component**: `components/layout/dynamic-footer.tsx`
- **Features**:
  - Pulls data from database for contact info, social media, and footer links
  - Automatically groups footer links by category
  - Displays social media icons with custom colors
  - Responsive design with proper fallbacks

### 5. Fully SSR Contact Page
- **Page**: `app/contact/page.tsx`
- **Features**:
  - Server-side rendered for better SEO
  - Dynamic contact information from database
  - Dynamic working hours display
  - Dynamic social media links with custom icons and colors
  - Dynamic Google Maps embed
  - Fallback data in case of database errors

## Database Models

### ContactSettings
```typescript
{
  phone: String,
  email: String,
  address: String,
  workingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  mapEmbedUrl: String
}
```

### SocialMedia
```typescript
{
  name: String,
  url: String,
  icon: String, // facebook, instagram, twitter, youtube, linkedin, website
  isActive: Boolean,
  showInFooter: Boolean,
  showInContact: Boolean,
  order: Number,
  color: String // Hex color code
}
```

### FooterLinks
```typescript
{
  name: String,
  url: String,
  category: String, // quick-links, categories, legal
  isActive: Boolean,
  order: Number
}
```

## API Endpoints

### Admin Endpoints (Protected)
- `GET/PUT /api/admin/contact-settings` - Manage contact settings
- `GET/POST /api/admin/social-media` - Manage social media links
- `PUT/DELETE /api/admin/social-media/[id]` - Update/delete specific social media
- `PUT /api/admin/social-media/reorder` - Reorder social media links
- `GET/POST /api/admin/footer-links` - Manage footer links
- `PUT/DELETE /api/admin/footer-links/[id]` - Update/delete specific footer link

### Public Endpoints
- `GET /api/contact-settings` - Get contact settings for frontend
- `GET /api/social-media` - Get active social media links
- `GET /api/footer-links` - Get active footer links

## Admin Navigation
The admin dashboard now includes three new management options:
- **Contact Settings** - Manage basic contact information
- **Social Media** - Manage social media links and ordering
- **Footer Links** - Manage footer navigation links

## Seeding Data
Run the following command to populate the database with default data:
```bash
npm run seed-contact-data
```

This will create:
- Default contact settings
- Sample social media links (Facebook, Instagram, Twitter, YouTube, LinkedIn)
- Default footer links organized by category

## Key Features

### Drag & Drop Reordering
Social media links can be reordered using drag and drop functionality in the admin interface. Changes are immediately saved to the database.

### Real-time Updates
All changes made in the admin interface are immediately reflected on the frontend without requiring a server restart.

### Responsive Design
All components are fully responsive and work seamlessly across desktop, tablet, and mobile devices.

### SEO Optimized
The contact page is server-side rendered, ensuring better SEO performance and faster initial page loads.

### Error Handling
Comprehensive error handling with fallback data ensures the site continues to function even if the database is unavailable.

## Usage Instructions

### Adding Social Media Links
1. Go to `/admin/social-media`
2. Click "Add Social Media"
3. Fill in the name, URL, choose an icon, and set a color
4. Toggle visibility options for footer and contact page
5. Save the changes

### Managing Contact Information
1. Go to `/admin/contact-settings`
2. Update phone, email, address, or working hours
3. Update the Google Maps embed URL if needed
4. Click "Save Changes"

### Managing Footer Links
1. Go to `/admin/footer-links`
2. Select the appropriate category tab
3. Add, edit, or delete links as needed
4. Toggle active status to show/hide links

## Technical Implementation

### Dependencies Added
- `@hello-pangea/dnd` - For drag and drop functionality
- All UI components use existing Radix UI components

### File Structure
```
models/
├── ContactSettings.ts
├── SocialMedia.ts
└── FooterLinks.ts

app/api/
├── admin/
│   ├── contact-settings/
│   ├── social-media/
│   └── footer-links/
├── contact-settings/
├── social-media/
└── footer-links/

components/
├── admin/
│   ├── contact-settings-manager.tsx
│   ├── social-media-manager.tsx
│   └── footer-links-manager.tsx
└── layout/
    └── dynamic-footer.tsx

app/
├── admin/
│   ├── contact-settings/
│   ├── social-media/
│   └── footer-links/
└── contact/
    └── page.tsx (Updated to SSR)
```

This implementation provides a complete, scalable solution for managing contact information and social media presence with a user-friendly admin interface.