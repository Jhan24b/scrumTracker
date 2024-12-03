'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Clock, Activity } from 'lucide-react'

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'Pendiente' | 'En Proceso' | 'Culminado';
  duracion: number;
}

interface Sprint {
  id: string;
  titulo: string;
  duracion: number;
  unidad: 'horas' | 'dias' | 'semanas';
  actividades: string[];
}

interface Proyecto {
  id: string;
  titulo: string;
  codigo: string;
  participantes: string[];
  areas: string[];
  sprints: Sprint[];
  actividades: Actividad[];
}

export default function ProjectManagement() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [nuevoProyecto, setNuevoProyecto] = useState<Proyecto>({
    id: '',
    titulo: '',
    codigo: '',
    participantes: [],
    areas: [],
    sprints: [],
    actividades: []
  })
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [actividadesExistentes, setActividadesExistentes] = useState<Actividad[]>([])

  useEffect(() => {
    const storedProyectos = localStorage.getItem('proyectos')
    if (storedProyectos) {
      setProyectos(JSON.parse(storedProyectos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('proyectos', JSON.stringify(proyectos))
  }, [proyectos])

  useEffect(() => {
    const storedActividades = localStorage.getItem('actividades')
    if (storedActividades) {
      setActividadesExistentes(JSON.parse(storedActividades))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoProyecto({ ...nuevoProyecto, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string, field: string) => {
    setNuevoProyecto({ ...nuevoProyecto, [field]: value.split(',') })
  }

  const handleAddSprint = () => {
    setNuevoProyecto({
      ...nuevoProyecto,
      sprints: [
        ...nuevoProyecto.sprints,
        { id: Date.now().toString(), titulo: '', duracion: 0, unidad: 'horas', actividades: [] }
      ]
    })
  }

  const handleSprintChange = (index: number, field: string, value: string | number) => {
    const updatedSprints = [...nuevoProyecto.sprints]
    updatedSprints[index] = { ...updatedSprints[index], [field]: value }
    setNuevoProyecto({ ...nuevoProyecto, sprints: updatedSprints })
  }

  const handleAddActividad = (actividadExistente?: Actividad) => {
    if (actividadExistente) {
      setNuevoProyecto({
        ...nuevoProyecto,
        actividades: [...nuevoProyecto.actividades, { ...actividadExistente, id: Date.now().toString() }]
      })
    } else {
      setNuevoProyecto({
        ...nuevoProyecto,
        actividades: [
          ...nuevoProyecto.actividades,
          { id: Date.now().toString(), titulo: '', descripcion: '', estado: 'Pendiente', duracion: 0 }
        ]
      })
    }
  }

  const handleActividadChange = (index: number, field: string, value: string | number) => {
    const updatedActividades = [...nuevoProyecto.actividades]
    updatedActividades[index] = { ...updatedActividades[index], [field]: value }
    setNuevoProyecto({ ...nuevoProyecto, actividades: updatedActividades })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const generatedCode = generateProjectCode()
    const newProject = { ...nuevoProyecto, id: Date.now().toString(), codigo: generatedCode }
    setProyectos([...proyectos, newProject])
    setNuevoProyecto({
      id: '',
      titulo: '',
      codigo: '',
      participantes: [],
      areas: [],
      sprints: [],
      actividades: []
    })
    setShowNewProjectDialog(false)
  }

  const generateProjectCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const calcularDuracionTotal = (proyecto: Proyecto) => {
    return proyecto.sprints.reduce((total, sprint) => {
      let duracion = sprint.duracion
      if (sprint.unidad === 'semanas') duracion *= 7 * 24
      else if (sprint.unidad === 'dias') duracion *= 24
      return total + duracion
    }, 0)
  }

  const calcularProgreso = (proyecto: Proyecto) => {
    const total = proyecto.actividades.length
    const completadas = proyecto.actividades.filter(a => a.estado === 'Culminado').length
    return total > 0 ? (completadas / total) * 100 : 0
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" name="titulo" value={nuevoProyecto.titulo} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="participantes">Participantes</Label>
                <Input id="participantes" name="participantes" value={nuevoProyecto.participantes.join(',')} onChange={(e) => handleSelectChange(e.target.value, 'participantes')} placeholder="Separados por comas" />
              </div>
              <div>
                <Label htmlFor="areas">Áreas</Label>
                <div className="flex flex-wrap gap-2">
                  {['Administración', 'Sistemas', 'RR.HH.'].map((area) => (
                    <Button
                      key={area}
                      type="button"
                      variant={nuevoProyecto.areas.includes(area) ? "default" : "outline"}
                      onClick={() => {
                        const updatedAreas = nuevoProyecto.areas.includes(area)
                          ? nuevoProyecto.areas.filter((a) => a !== area)
                          : [...nuevoProyecto.areas, area];
                        setNuevoProyecto({ ...nuevoProyecto, areas: updatedAreas });
                      }}
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <Label>Sprints</Label>
                {nuevoProyecto.sprints.map((sprint, index) => (
                  <div key={sprint.id} className="flex space-x-2 mt-2">
                    <Input placeholder="Título" value={sprint.titulo} onChange={(e) => handleSprintChange(index, 'titulo', e.target.value)} />
                    <Input type="number" placeholder="Duración" value={sprint.duracion} onChange={(e) => handleSprintChange(index, 'duracion', parseInt(e.target.value))} />
                    <Select onValueChange={(value) => handleSprintChange(index, 'unidad', value)} value={sprint.unidad}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horas">Horas</SelectItem>
                        <SelectItem value="dias">Días</SelectItem>
                        <SelectItem value="semanas">Semanas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button type="button" onClick={handleAddSprint}>Agregar Sprint</Button>
              </div>
              <div>
                <Label>Actividades</Label>
                {nuevoProyecto.actividades.map((actividad, index) => (
                  <div key={actividad.id} className="space-y-2 mt-2">
                    <Input placeholder="Título" value={actividad.titulo} onChange={(e) => handleActividadChange(index, 'titulo', e.target.value)} />
                    <Textarea placeholder="Descripción" value={actividad.descripcion} onChange={(e) => handleActividadChange(index, 'descripcion', e.target.value)} />
                    <Select onValueChange={(value) => handleActividadChange(index, 'estado', value)} value={actividad.estado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Proceso">En Proceso</SelectItem>
                        <SelectItem value="Culminado">Culminado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Duración (horas)" value={actividad.duracion} onChange={(e) => handleActividadChange(index, 'duracion', parseInt(e.target.value))} />
                  </div>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Select onValueChange={(value) => {
                    const actividad = actividadesExistentes.find(a => a.id === value)
                    if (actividad) handleAddActividad(actividad)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar actividad existente" />
                    </SelectTrigger>
                    <SelectContent>
                      {actividadesExistentes.map((actividad) => (
                        <SelectItem key={actividad.id} value={actividad.id}>{actividad.titulo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={() => handleAddActividad()}>Nueva Actividad</Button>
                </div>
              </div>
              <Button type="submit">Crear Proyecto</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proyectos.map((proyecto) => (
          <Card key={proyecto.id} className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>{proyecto.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Código: {proyecto.codigo}</p>
              <div className="flex items-center mb-2">
                <Users className="mr-2 h-4 w-4" />
                <span className="text-sm">{proyecto.participantes.join(', ')}</span>
              </div>
              <div className="flex items-center mb-2">
                <Activity className="mr-2 h-4 w-4" />
                <span className="text-sm">{proyecto.areas.join(', ')}</span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm">{calcularDuracionTotal(proyecto)} horas</span>
              </div>
              <Progress value={calcularProgreso(proyecto)} className="mb-2" />
              <p className="text-sm text-right">{calcularProgreso(proyecto).toFixed(0)}% Completado</p>
            </CardContent>
            <CardFooter className="bg-muted">
              <div className="w-full">
                <h4 className="font-semibold mb-2">Actividades</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {['Pendiente', 'En Proceso', 'Culminado'].map((estado) => (
                    <div key={estado}>
                      <h5 className="text-sm font-medium">{estado}</h5>
                      <ul className="list-disc list-inside text-sm">
                        {proyecto.actividades
                          .filter(a => a.estado === estado)
                          .map(a => <li key={a.id}>{a.titulo}</li>)
                        }
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}