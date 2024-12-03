import ProjectView from '@/app/components/project-view'
import { ThemeProvider } from 'next-themes'


export default function ActividadesPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectView />
    </ThemeProvider>
  )
}
