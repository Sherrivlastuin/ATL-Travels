# ATL TRAVELS - Luxury Travel Website

A modern, fully responsive Next.js 16 travel website for "ATL TRAVELS" - a luxury travel planning service specializing in handpicked villas, boutique hotels, and once-in-a-lifetime experiences.

## Features

✨ **Modern Design**
- Beautiful gradient backgrounds and glassmorphism effects
- Smooth animations and scroll-triggered reveals with GSAP
- Fully responsive design (mobile, tablet, desktop)
- Professional color scheme with accent highlights

🎯 **Key Sections**
- **Header & Navigation** - Fixed sticky header with mobile-responsive menu
- **Hero Section** - Eye-catching hero with background image and interactive booking form
- **Quick CTAs** - Two prominent call-to-action cards
- **Destinations Carousel** - Scrollable carousel of popular destinations with pricing
- **Partner Promos** - Partnership showcases (Viator, Airbnb)
- **Flights Section** - Flight deals and booking information
- **Testimonials** - Customer reviews and ratings
- **Contact Form** - Full contact form with multiple contact methods
- **Footer** - Comprehensive footer with links, social media, and company info

⚡ **Technical Stack**
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Fonts**: Poppins (body) and Playfair Display (headings)
- **Icons**: Lucide React
- **Animations**: GSAP with ScrollTrigger
- **TypeScript**: Full type safety throughout

🎨 **Design System**
- **Primary Color**: #0B1E3D (Dark Blue)
- **Accent Color**: #F3723B (Orange)
- **Gradients**: Soft blue/sky gradients
- **Custom Styles**: Glass morphism, hover effects, smooth transitions

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

## Project Structure

```
components/
├── header.tsx           # Navigation and mobile menu
├── hero.tsx            # Hero section with booking form
├── quick-ctas.tsx      # Call-to-action cards
├── destinations-carousel.tsx  # Scrollable destinations
├── partner-promo.tsx   # Partner showcases
├── flights.tsx         # Flight deals
├── testimonials.tsx    # Customer reviews
├── contact.tsx         # Contact form
└── footer.tsx          # Footer section

app/
├── layout.tsx          # Root layout with fonts
├── page.tsx            # Main page with animations
└── globals.css         # Global styles and theme
```

## Components Used

- **React Client Components** - For interactive elements
- **GSAP Animations** - Scroll-triggered section reveals
- **Responsive Grid Layouts** - Mobile-first approach
- **Form Handling** - Functional booking and contact forms
- **Image Optimization** - External image sources

## Customization

All colors, fonts, and styling are defined in:
- `app/globals.css` - CSS variables and custom classes
- `app/layout.tsx` - Font configuration
- Tailwind classes throughout components

To modify the design, update:
1. CSS custom properties in `:root` section
2. Tailwind color mappings
3. Component className values

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Created with v0.app
