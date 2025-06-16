# IMISLab - Unified Frontend and Backend Project

## 馃搧 Project Structure

`
IMISLab-Unified-Fixed/
鈹溾攢鈹€ frontend/              # Vue3 Frontend Application
鈹?  鈹溾攢鈹€ src/              # Frontend source code
鈹?  鈹溾攢鈹€ public/           # Static assets
鈹?  鈹溾攢鈹€ package.json      # Frontend dependencies
鈹?  鈹斺攢鈹€ vite.config.ts    # Vite configuration
鈹溾攢鈹€ backend/              # Go Backend API
鈹?  鈹溾攢鈹€ controller/       # API controllers
鈹?  鈹溾攢鈹€ service/          # Business logic
鈹?  鈹溾攢鈹€ entity/           # Data models
鈹?  鈹溾攢鈹€ main.go          # Backend entry point
鈹?  鈹斺攢鈹€ go.mod           # Go dependencies
鈹溾攢鈹€ docs/                 # Project documentation
鈹溾攢鈹€ .vscode/             # VS Code configuration
鈹溾攢鈹€ start-project.ps1    # One-click startup script
鈹溾攢鈹€ deploy.ps1           # Deployment script
鈹斺攢鈹€ README.md            # This file
`

## 馃殌 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.19+
- Git

### Development Setup

1. **Clone the repository**
   `ash
   git clone <your-repo-url>
   cd IMISLab-Unified-Fixed
   `

2. **Install frontend dependencies**
   `ash
   cd frontend
   npm install
   cd ..
   `

3. **Start the development environment**
   `ash
   # Option 1: Use one-click script (Recommended)
   ./start-project.ps1
   
   # Option 2: Manual startup
   # Terminal 1 - Backend
   cd backend
   go run main.go
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   `

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3344

## 馃洜锔?Technology Stack

### Frontend
- **Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia
- **Styling**: UnoCSS
- **Testing**: Vitest + Playwright

### Backend
- **Language**: Go 1.19+
- **Framework**: Gin Web Framework
- **ORM**: GORM
- **Database**: SQLite (development), MySQL (production)

## 馃摑 Available Scripts

### Frontend (in frontend/ directory)
- 
pm run dev - Start development server
- 
pm run build - Build for production
- 
pm run test:unit - Run unit tests
- 
pm run test:e2e - Run E2E tests

### Backend (in backend/ directory)
- go run main.go - Start development server
- go build - Build for production
- go test ./... - Run tests

### Project Scripts (in root directory)
- ./start-project.ps1 - Start both frontend and backend
- ./deploy.ps1 - Deploy to production

## 馃摎 Documentation

For detailed documentation, please check the docs/ directory:
- API Documentation
- Development Guidelines
- Deployment Instructions

## 馃 Contributing

1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 馃搫 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 馃敡 Development Notes

- Frontend development server runs on port 5173
- Backend API server runs on port 3344
- Hot reload is enabled for both frontend and backend during development
- Use the one-click startup script for the best development experience

---

Happy coding! 馃帀
