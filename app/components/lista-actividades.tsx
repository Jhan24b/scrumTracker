'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Actividad {
  id: string;
  fecha: string;
  titulo: string;
  area: string;
  descripcion: string;
  duracion: number;
  observaciones: string[];
  estado: string;
}

export default function ListaActividades({ onEditActividad }: { onEditActividad: (actividad: Actividad) => void }) {
  const getFormattedDate = () => new Date().toISOString().split('T')[0];
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(getFormattedDate())

  useEffect(() => {
    const actividadesGuardadas = localStorage.getItem('actividades')
    try {
      if (actividadesGuardadas) {
        setActividades(JSON.parse(actividadesGuardadas))
      }
    } catch (error) {
      console.error(`Error parsing JSON: ${error}`)
      // Handle the error gracefully, e.g., set default activities or show a message to the user
    }
  }, [])

  const actividadesFiltradas = actividades.filter(act => act.fecha === fechaSeleccionada)

  const handleActividadEdit = (actividad: Actividad) => {
    onEditActividad(actividad)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-[#1a4d4d] text-gray-900 dark:text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Actividades del día</CardTitle>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-[#3d6b6b] bg-white dark:bg-[#2a5a5a] text-gray-900 dark:text-white"
        />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {actividadesFiltradas.map((actividad) => (
            <li key={actividad.id} className="border-b border-gray-200 dark:border-[#3d6b6b] pb-2 flex justify-between px-4">
              <div><h3 className="font-semibold">{actividad.titulo}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{actividad.descripcion}</p></div>
              <div className="flex justify-between items-center mt-2 gap-4">
                <span className="text-s text-cyan-800 font-bold w-[106px] px-2">{actividad.estado}</span>
                <Button
                  onClick={() => handleActividadEdit(actividad)}
                  disabled={fechaSeleccionada !== getFormattedDate()}
                  className="text-xs py-1 px-2 bg-gray-200 dark:bg-[#3d6b6b] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#4d7b7b]"
                >
                  Editar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}