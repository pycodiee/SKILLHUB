# 🎓 Skill Hub - Gamified & Interactive Learning Platform


## 🌟 Overview

Skill Hub is a cutting-edge educational platform that transforms traditional learning into an engaging, interactive experience. By connecting teachers, students, and resources in one unified ecosystem, Skill Hub makes skill acquisition not just educational but exciting through gamification, interactive learning tools, and AI-powered features.

## ✨ Key Features

### 🎯 Core Platform Components
- **📚 Teacher Hub** - Upload content, track student progress, and analyze learning data
- **🧠 Student Portal** - Personalized learning journey with progress tracking
- **💻 Skill Hub** - Interactive code editor with real-time feedback
- **📝 Resume Builder** - Create professional resumes showcasing acquired skills
- **🤖 Learn Genie** - AI-powered learning assistant for personalized guidance

### 🎮 Gamification Elements
- **🏆 Achievement System** - Earn badges and certificates for completing challenges
- **⭐ Experience Points (XP)** - Gain XP for completing learning activities
- **🌳 Skill Trees** - Visual progression paths for different knowledge domains
- **🔥 Learning Streaks** - Maintain consistent learning streaks for bonus rewards
- **🏅 Leaderboards** - Compete with peers on progress and achievements
- **🧩 Interactive Challenges** - Apply knowledge through engaging quizzes and projects

### 📊 Analytics & Progress Tracking
- **Student Learning Analytics** - Track progress across different skills and courses
- **Personalized Learning Paths** - Recommended content based on skill level and interests
- **Detailed Progress Reports** - Visual representation of learning journey
- **Real-time Feedback** - Immediate assessment of knowledge comprehension

## 🛠️ Technology Stack

### Frontend
- **React.js with TypeScript** - For building a robust, type-safe UI
- **Tailwind CSS** - For responsive, customized styling
- **Shadcn UI Components** - For consistent, accessible UI elements
- **Lucide React** - For beautiful, scalable icons
- **React Router** - For seamless navigation between components
- **Axios** - For efficient API communication

### Backend
- **Node.js & Express.js** - For scalable server-side architecture
- **PostgreSQL** - For reliable relational data storage
- **Prisma ORM** - For type-safe database access
- **JWT Authentication** - For secure user sessions
- **OAuth Integration** - For simplified login with Google, GitHub, etc.


## 📱 Platform Features

### For Teachers
- **Content Management** - Upload and manage educational videos
- **Student Progress Tracking** - Monitor learning progress with detailed analytics
- **Learning Data Analysis** - Review student goals and notes
- **Custom Course Creation** - Design personalized learning paths
- **Assessment Tools** - Create quizzes and interactive challenges

### For Students
- **Personalized Dashboard** - Customized learning experience
- **Interactive Learning** - Engage with educational content actively
- **Skill Tracking** - Monitor progress in various technical and soft skills
- **Real-time Feedback** - Get immediate assessment of learning activities
- **Social Learning** - Collaborate with peers on projects and challenges
- **Rewards System** - Earn badges, certificates, and level up with XP

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/ahamed-ali-git/Skill_Hub.git
cd Skill Hub
```

2. Install dependencies
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Configure environment variables
```bash
# Create .env file in server directory
cp .env.example .env
# Edit .env with your PostgreSQL credentials and other config
```

4. Initialize the database
```bash
cd Backend
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
cd ../client
npm run dev
```

6. Access the application at `http://localhost:3000`

## 📝 API Documentation

Our API follows RESTful principles and includes endpoints for:

- User Authentication & Management
- Course & Content Management
- Progress Tracking & Analytics
- Student-Teacher Interactions
- Gamification Elements

## 🤝 Contributing

We welcome contributions to EduVerse! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our linting rules and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
