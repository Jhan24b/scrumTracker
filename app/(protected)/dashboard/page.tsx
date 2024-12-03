import ProjectDashboard from '@/app/components/project-dashboard'
import { ThemeProvider } from 'next-themes'


export default function DashboardPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4">
        <ProjectDashboard />
      </div>
    </ThemeProvider>
  )
}