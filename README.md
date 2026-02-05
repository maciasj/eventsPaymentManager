# Event Manager PWA 🎉

A Progressive Web App for managing events, tracking hours worked, and monitoring payments. Built with React + Vite, works perfectly on iPhone without the App Store!

## Features ✨

- **📅 Interactive Calendar** - Click any day to create events
- **🎭 Three Event Types**
  - Partido (Sports events)
  - Concierto (Concerts)
  - Fira (Fairs - can span multiple days)
- **⏱️ Hours Tracking** - Log hours worked for each event
- **💰 Payment Management** - Track expected vs real payments
- **✅ Payment Status** - Mark events as paid/unpaid
- **📊 Monthly Reports** - View outstanding payments and totals by month
- **🔄 Offline Support** - Works without internet, syncs when online
- **📱 PWA Ready** - Install on iPhone home screen like a native app

## Technology Stack 🛠️

- **Frontend**: Vite + React
- **Backend**: Supabase (free tier)
- **Offline Storage**: IndexedDB (Dexie.js)
- **PWA**: Workbox via vite-plugin-pwa
- **Styling**: Modern CSS with custom design system
- **Hosting**: Netlify/Vercel (free)

## Setup Instructions 🚀

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (Optional but Recommended)

If you want cross-device sync:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In the SQL Editor, run this schema:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Partido', 'Concierto', 'Fira')),
  start_date DATE NOT NULL,
  end_date DATE,
  hours_worked NUMERIC DEFAULT 0,
  payment_expected NUMERIC DEFAULT 0,
  payment_real NUMERIC DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

4. Copy your project URL and anon key from Settings > API
5. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: The app works completely offline without Supabase, but data will only be stored locally on one device.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Deployment 🌐

### Deploy to Netlify (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Connect your GitHub repository
5. Add environment variables (if using Supabase):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Add environment variables in Settings
5. Deploy!

## Installing on iPhone 📱

1. Open the deployed app URL in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen
6. Launch it like any native app!

## Usage Guide 📖

### Creating Events

1. Go to the Calendar view
2. Tap any day
3. Enter event name, select type (Partido/Concierto/Fira)
4. For Fira events, you can select a date range
5. Tap "Crear Evento"

### Managing Events

1. Go to the Events view
2. See all your events with filters (All/Upcoming/Unpaid)
3. Edit hours worked, expected payment, and real payment inline
4. Toggle payment status between Paid/Unpaid
5. Delete events with the trash icon

### Monthly Reports

1. Go to the Summary view
2. Navigate between months
3. View:
   - Total paid
   - Outstanding payments
   - Total hours worked
   - Breakdown by event type

## Offline Support 🔌

- The app works completely offline
- All changes are saved locally
- When you come back online, changes sync automatically to Supabase
- You'll see a sync indicator at the bottom showing online/offline status

## Browser Support 🌍

- ✅ iOS Safari 12+
- ✅ Chrome (Desktop & Mobile)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet

## Cost Breakdown 💰

Everything is **100% FREE**:

- ✅ Hosting: Netlify/Vercel free tier
- ✅ Backend: Supabase free tier (500MB database, 2GB bandwidth/month)
- ✅ Domain: Free subdomain (e.g., yourapp.netlify.app)
- ✅ No Apple Developer Account needed ($0 vs $99/year)

## Development 👨‍💻

```bash
# Install dependencies
npm install

# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure 📁

```
src/
├── components/
│   ├── Calendar/         # Calendar view & styles
│   ├── EventList/        # Events list & styles
│   ├── MonthlyReport/    # Monthly summary & styles
│   └── shared/           # Shared components (Modal, Navigation)
├── hooks/
│   └── useEvents.js      # Event management hook with offline support
├── services/
│   ├── supabase.js       # Supabase client & API calls
│   └── indexedDB.js      # Local storage & sync queue
├── styles/
│   └── globals.css       # Design system & global styles
├── App.jsx               # Main app component
└── main.jsx              # Entry point
```

## Troubleshooting 🔧

### App won't install on iPhone

- Make sure you're using Safari (not Chrome or other browsers)
- Check that the site is served over HTTPS
- Try force-refreshing the page

### Data not syncing

- Check your internet connection
- Verify Supabase credentials in `.env`
- Check browser console for errors

### Events not appearing

- Clear browser cache and reload
- Check IndexedDB in browser DevTools
- Verify Supabase table structure matches schema

## License 📄

MIT License - feel free to use this for personal or commercial projects!

## Support 💬

If you encounter issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. Application tab > Service Workers for PWA status

---

**Built with ❤️ using React, Vite, and Supabase**
