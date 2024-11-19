import ProjectDashboard from '@/app/components/project-dashboard'
import { ThemeProvider } from 'next-themes'


export default function DashboardPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Proyectos</h1>
        <ProjectDashboard />
      </div>
    </ThemeProvider>
  )
}