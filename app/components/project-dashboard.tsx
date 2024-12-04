'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Project {
  id: string;
  titulo: string;
  area: string;
  estado: 'Pendiente' | 'En Proceso' | 'Culminado';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const storedProjects = localStorage.getItem('actividades')
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects))
    }
  }, [])

  const statusCounts = {
    'Pendiente': projects.filter(p => p.estado === 'Pendiente').length,
    'En Proceso': projects.filter(p => p.estado === 'En Proceso').length,
    'Culminado': projects.filter(p => p.estado === 'Culminado').length,
  }

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const areaData = projects.reduce((acc, project) => {
    acc[project.area] = (acc[project.area] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const areaChartData = Object.entries(areaData).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full px-8">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className=''>Resumen de Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length} Proyectos Totales</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Proyectos</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="30%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Proyectos por Área</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaChartData}>
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} />
              <YAxis stroke={theme === 'dark' ? '#fff' : '#000'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#333' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Detalles de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Área</th>
                  <th className="text-center p-2">Pendiente</th>
                  <th className="text-center p-2">En Proceso</th>
                  <th className="text-center p-2">Culminado</th>
                  <th className="text-center p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(areaData).map(([area, total]) => (
                  <tr key={area} className="border-b">
                    <td className="p-2">{area}</td>
                    <td className="text-center p-2">{projects.filter(p => p.area === area && p.estado === 'Pendiente').length}</td>
                    <td className="text-center p-2">{projects.filter(p => p.area === area && p.estado === 'En Proceso').length}</td>
                    <td className="text-center p-2">{projects.filter(p => p.area === area && p.estado === 'Culminado').length}</td>
                    <td className="text-center p-2">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}