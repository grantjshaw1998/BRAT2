# Bible Research App v2.0 📖

A modern, full-featured Bible study application built with React, TypeScript, and Supabase. Designed for serious Bible study with advanced search, note-taking, highlighting, and collaborative study features.

![Bible Research App](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-blue)

## ✨ Features

### 📚 **Bible Reading**
- Complete Bible with all 66 books
- Chapter-by-chapter navigation
- Responsive design for all devices
- Clean, readable typography

### 🔍 **Advanced Search**
- Full-text search across all scriptures
- Search within specific books
- Highlight search terms in results
- Fast, indexed search powered by PostgreSQL

### 📝 **Note Taking**
- Create personal study notes
- Link notes to specific verses
- Organize with custom tags
- Rich text editing support

### 🎨 **Highlighting System**
- Multiple highlight colors
- Verse-level highlighting
- Personal and shareable highlights
- Visual verse marking

### 👥 **Study Circles**
- Create private study groups
- Share notes and highlights
- Collaborative Bible study
- Invite system with codes

### 📅 **Reading Plans**
- Pre-built reading plans
- Custom plan creation
- Progress tracking
- Daily reading goals

### ⚙️ **Customization**
- Dark/Light/Sepia themes
- Adjustable font sizes
- Text-to-speech support
- Offline reading capability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/bible-app-v2.0.git
cd bible-app-v2.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Set up the database**
```bash
# Upload Bible books
npm run upload-books

# Upload sample verses
npm run upload-sample-verses

# Verify database
npm run check-db
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🏗️ Architecture

### **Frontend Stack**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### **Backend Stack**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database with full-text search
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

### **Key Services**
- `BibleService` - Bible data management
- `NoteService` - Note CRUD operations
- `HighlightService` - Highlighting system
- `CircleService` - Study group management
- `SearchService` - Advanced search functionality

## 📊 Database Schema

### Core Tables
- `bible_books` - 66 Bible books with metadata
- `verses` - Complete Bible text with search vectors
- `users` - User profiles and authentication
- `notes` - User study notes with tagging
- `highlights` - Verse highlighting system
- `circles` - Study groups and collaboration
- `reading_plans` - Reading plan management

### Features
- Full-text search with PostgreSQL's `tsvector`
- Row Level Security for data privacy
- Foreign key relationships for data integrity
- Optimized indexes for fast queries

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run upload-books # Upload Bible books to database
npm run upload-sample-verses # Upload sample verses
npm run check-db     # Verify database contents
```

### Project Structure
```
src/
├── components/          # React components
│   ├── Auth/           # Authentication
│   ├── Bible/          # Bible reading
│   ├── Dashboard/      # Main dashboard
│   ├── Layout/         # App layout
│   ├── Notes/          # Note management
│   ├── Search/         # Search interface
│   └── Settings/       # User settings
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and config
├── services/           # API services
└── types/              # TypeScript types
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy with zero configuration

### Manual Build
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bible text sourced from public domain translations
- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by modern design systems
- Built with love for Bible study and research

## 📞 Support

- 📧 Email: support@bibleapp.com
- 💬 Discord: [Join our community](https://discord.gg/bibleapp)
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/bible-app-v2.0/issues)

---

**Made with ❤️ for Bible study and research**