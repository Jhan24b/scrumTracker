import ProjectManagement from '@/app/components/project-management'
import { ThemeProvider } from 'next-themes'


export default function ProjectsPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectManagement />
    </ThemeProvider>
  )
}