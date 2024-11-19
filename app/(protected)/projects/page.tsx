import ProjectView from '@/app/components/project-view'
import { ThemeProvider } from 'next-themes'


export default function ProjectsPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectView />
    </ThemeProvider>
  )
}