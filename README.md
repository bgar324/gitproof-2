# GitProof

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

GitProof is a modern web application that helps developers showcase and analyze their GitHub contributions in a visually appealing way. It provides insights into your coding impact, classifies your developer archetype, and creates beautiful, shareable reports of your open-source work.

## ✨ Features

- **GitHub Integration**: Connect with your GitHub account to analyze your public repositories
- **Impact Scoring**: Get a comprehensive score based on your contributions, project quality, and community impact
- **Developer Archetypes**: Discover your developer archetype (e.g., "The Architect", "The Machine", "10x Engineer")
- **Project Analysis**: Detailed insights into your GitHub projects including stars, forks, and language distribution
- **Beautiful Reports**: Generate and share beautiful, professional reports of your work
- **Privacy Focused**: Read-only access to your public data with transparent data handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm
- PostgreSQL database
- GitHub OAuth App credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/gitproof-2.git
   cd gitproof-2
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in your GitHub OAuth credentials and database URL

4. Set up the database:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: Google's Generative AI for analysis and insights
- **Deployment**: Vercel
- **Icons**: Lucide Icons
- **Data Visualization**: Recharts

## 📊 Data Model

### User

- Basic profile information (name, email, username, bio)
- Account settings and preferences
- Connection to GitHub account

### Project

- GitHub repository details (name, description, URL)
- Metrics (stars, forks, last push)
- Impact score and AI-generated description
- Language and topic tags

## 🔒 Security

- OAuth 2.0 with GitHub (read-only access to public data)
- Secure session management with JWT
- Environment-based configuration
- Prisma for type-safe database queries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and TypeScript
- Inspired by the need for better developer portfolio tools
- Thanks to all contributors who have helped improve this project
