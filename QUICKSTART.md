# Quick Start Guide 🚀

## For Users

### Install on iPhone
1. Open the app URL in Safari
2. Tap Share → "Add to Home Screen"
3. Tap "Add"
4. Launch from home screen like any app!

### Create Events
1. **Calendar Tab** → Tap a day
2. Enter event name
3. Select type:
   - **Partido**: Single-day sports event
   - **Concierto**: Single-day concert
   - **Fira**: Multi-day fair (select date range)
4. Tap "Crear Evento"

### Track Hours & Payments
1. **Eventos Tab** → Find your event
2. Enter hours worked
3. Enter expected payment
4. Enter real payment
5. Toggle "Pagado/Pendiente" when paid

### View Monthly Summary
1. **Resumen Tab**
2. Navigate months with arrows
3. See:
   - Total paid this month
   - Outstanding (unpaid) amounts
   - Total hours worked
   - Breakdown by event type

### Offline Mode
- ✅ Works without internet
- ✅ All changes saved locally
- ✅ Auto-syncs when back online

---

## For Developers

### Local Development
```bash
npm install
npm run dev
```

### Environment Setup
```bash
# Copy example env file
cp .env.example .env.local

# Add your Supabase credentials (optional)
# Leave empty to use offline-only mode
```

### Build for Production
```bash
npm run build
npm run preview
```

### Deploy
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

**Quick Deploy:**
1. Push to GitHub
2. Import to Netlify/Vercel
3. Add environment variables
4. Deploy!

### Project Structure
```
src/
├── components/      # UI components
├── hooks/          # useEvents hook
├── services/       # Supabase & IndexedDB
└── styles/         # Design system
```

### Key Technologies
- **React 19** - UI library
- **Vite 7** - Build tool
- **Supabase** - Backend (optional)
- **Dexie.js** - IndexedDB wrapper
- **date-fns** - Date utilities
- **Workbox** - Service worker

---

## Common Tasks

### Add Environment Variables
```bash
# Edit .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### Test PWA Locally
```bash
npm run build
npm run preview
# Open in browser → DevTools → Application → Service Workers
```

### Clear Local Data
```javascript
// In browser console:
indexedDB.deleteDatabase('EventManagerDB');
localStorage.clear();
location.reload();
```

### Check Bundle Size
```bash
npm run build
# Check dist/ folder size
```

---

## Troubleshooting

**Problem**: Events not saving
- **Check**: Browser console for errors
- **Try**: Clear IndexedDB and reload

**Problem**: Not syncing to Supabase
- **Check**: Network tab for failed requests
- **Verify**: Environment variables are set
- **Check**: Supabase table exists

**Problem**: Service Worker not updating
- **Solution**: Hard refresh (Ctrl+Shift+R)
- **Or**: Unregister SW in DevTools

**Problem**: Can't install on iPhone
- **Use**: Safari (not Chrome)
- **Check**: Site is HTTPS
- **Try**: Clear Safari cache

---

## Resources

- 📚 [README.md](./README.md) - Full documentation
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- 🗄️ [supabase-schema.sql](./supabase-schema.sql) - Database schema
- 🐛 [GitHub Issues](https://github.com/yourusername/event-manager-pwa/issues)

---

**Made with ❤️ using React + Vite + Supabase**
