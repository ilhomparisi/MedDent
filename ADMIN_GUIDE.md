# MedDent Admin Panel Guide

## Admin Access

### Login Credentials
- **URL**: `http://yoursite.com/adminlogin`
- **Email**: `admin@meddent.uz`
- **Password**: `admin123`

**IMPORTANT**: Change these credentials in production by updating the Supabase auth users table!

## Admin Panel Features

Access the admin panel at `/adminpanel` after logging in.

### 1. General Settings (Umumiy)

Configure core site information:

- **Branding**
  - Site Name
  - Tagline

- **Promotion Settings**
  - Enable/Disable offers
  - Set offer expiry date with countdown timer

- **Contact Information**
  - Phone number
  - Email address
  - Physical address

- **Working Hours**
  - Weekday hours (Monday - Friday)
  - Saturday hours
  - Sunday hours

- **Social Media**
  - Facebook URL
  - Instagram URL
  - Telegram URL

### 2. Color Settings (Ranglar)

Customize the entire color scheme:

- **Primary Color** - Main buttons and primary elements
- **Secondary Color** - Supporting elements
- **Accent Color** - Highlights and emphasis
- **Background Color** - Main background
- **Text Color** - Main text color

Features:
- Color picker for easy selection
- Hex code input for precise colors
- Live preview of color combinations

### 3. Text Settings (Matnlar)

Edit all text content across the site:

- **Hero Section**
  - Main headline
  - Subtitle
  - Primary CTA button text
  - Secondary CTA button text

- **Services Section**
  - Section title
  - Section subtitle

- **Doctors Section**
  - Section title
  - Section subtitle

- **Reviews Section**
  - Section title
  - Section subtitle

### 4. Image Settings (Rasmlar)

Manage background images for all sections:

- **Hero Section** - Main landing area (Recommended: 1920x1080px)
- **Features Section** - Features banner area (Recommended: 1920x600px)
- **Services Section** - Services background (Recommended: 1920x1080px)
- **Doctors Section** - Doctors background (Recommended: 1920x1080px)
- **Reviews Section** - Reviews background (Recommended: 1920x600px)

Features:
- URL input for images (recommended: Pexels.com)
- Opacity slider (0-100%)
- Live preview of images with opacity

**Image URL Format**: Use full URLs like `https://images.pexels.com/photos/...`

### 5. Doctors Management (Shifokorlar)

Full CRUD operations for doctors:

**Add New Doctor:**
- Name (required)
- Specialty (required)
- Years of experience (required)
- Education
- Biography
- Image URL
- Active status toggle

**Edit Doctor:**
- Update any field
- Toggle active/inactive status

**Delete Doctor:**
- Remove doctor from database

**Features:**
- Image support with fallback to initials
- Active/Inactive status
- Automatic scrolling carousel on frontend

### 6. Services Management (Xizmatlar)

Manage dental services offered:

**Add New Service:**
- Service name (required)
- Description (required)
- Price
- Duration
- Image URL
- Featured status (shows first)

**Edit Service:**
- Update any field
- Mark as featured service

**Delete Service:**
- Remove service from database

**Features:**
- Featured services displayed prominently
- Image support
- Card-based display on frontend

### 7. Reviews Management (Sharhlar)

Manage patient testimonials:

**Add New Review:**
- Patient name (required)
- Review text (required)
- Rating (1-5 stars)
- Service used
- Approved status

**Edit Review:**
- Update any field
- Change approval status

**Approve/Reject Reviews:**
- Quick toggle approval
- Only approved reviews show on site

**Delete Review:**
- Remove review from database

**Features:**
- Star rating system (1-5)
- Approval workflow
- Automatic scrolling carousel on frontend
- Shows only approved reviews on public site

## Image Guidelines

### Recommended Image Sources
- **Pexels.com** - Free professional photos
- **Unsplash.com** - Free high-quality images

### Image Size Recommendations
- Hero backgrounds: 1920x1080px
- Section backgrounds: 1920x600px or 1920x1080px
- Doctor photos: 400x400px (square)
- Service images: 800x600px

### How to Use Images
1. Find image on Pexels/Unsplash
2. Copy the direct image URL (ending in .jpg or .png)
3. Paste into the "Image URL" field
4. Adjust opacity if needed for readability

## Color Scheme Tips

### Professional Color Combinations
- Blue + White: Trust and cleanliness
- Green + White: Health and wellness
- Navy + Gold: Luxury and expertise

### Contrast Guidelines
- Ensure text is readable on all backgrounds
- Test color combinations in preview
- Use opacity to balance backgrounds with content

## Best Practices

### Content Management
1. **Regular Updates**: Keep services and doctors current
2. **Review Moderation**: Approve legitimate reviews only
3. **Image Quality**: Use high-resolution professional images
4. **Text Clarity**: Write clear, concise descriptions

### Design Consistency
1. **Color Harmony**: Stick to 2-3 main colors
2. **Typography**: Keep text readable and professional
3. **Spacing**: Use consistent spacing throughout

### Maintenance
1. **Backup**: Regularly backup database
2. **Updates**: Monitor and update promotions
3. **Reviews**: Respond to and moderate reviews
4. **Images**: Replace outdated or low-quality images

## Technical Notes

### Database Structure
- All settings stored in `site_settings` table
- Background images in `section_backgrounds` table
- Doctors, services, reviews in respective tables

### Security
- RLS (Row Level Security) enabled on all tables
- Authentication required for admin access
- Public users can only read approved content

### Performance
- Images loaded from CDN (Pexels)
- Optimized database queries
- Automatic caching where applicable

## Troubleshooting

### Images Not Showing
- Verify URL is direct link to image file
- Check URL starts with https://
- Ensure image URL is accessible

### Changes Not Appearing
- Click "Saqlash" (Save) button
- Refresh frontend page
- Clear browser cache if needed

### Login Issues
- Verify email and password
- Check Supabase connection
- Ensure auth is enabled in Supabase

## Support

For technical issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Check database table structures
4. Review RLS policies

## Future Enhancements

Potential additions:
- File upload for images (vs URLs)
- Analytics dashboard
- Appointment management
- Email notifications
- Multi-language support
- Theme presets
