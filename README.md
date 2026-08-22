
<<<<<<< HEAD

=======
  # Create attractive home page

  This is a code bundle for Create attractive home page. The original project is available at https://www.figma.com/design/7oScrOQvofKbEY6OZYhzTk/Create-attractive-home-page.
>>>>>>> 934850f (Update project)

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
<<<<<<< HEAD
  
=======
  
>>>>>>> 934850f (Update project)

# GlobeTrotter – Personalized Travel-Planning Web App

**Version:** 1.0.0 | **License:** MIT

## 📖 Overview
GlobeTrotter is a modern, collaborative travel-planning application that lets users create multi-city itineraries, add activities, calculate budgets, visualise timelines and share trips with friends.

* **Frontend:** React + Vite (styled with Tailwind CSS & modern UI components)
* **Backend:** Python 3, Django + Django REST Framework (DRF)
* **Database:** SQLite (built-in Django default)
* **Auth:** JWT via `djangorestframework-simplejwt`
* **CORS:** `django-cors-headers` to allow the React dev server to talk to the API

## 🗂 Repository Structure
```text
GlobeTrotter/
├─ backend/
│   ├─ globetrotter/        # Django project settings
│   ├─ core/                # Core app: models, serializers, viewsets, urls
│   ├─ db.sqlite3           # SQLite DB (auto-created)
│   └─ manage.py
├─ frontend/
│   ├─ src/                 # React source (components, API helpers, pages)
│   ├─ public/
│   ├─ vite.config.ts
│   ├─ package.json
│   └─ node_modules/
├─ .gitignore
└─ README.md                # ← you are here
