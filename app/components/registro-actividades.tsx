"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";

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

export default function RegistroActividades({
  actividadParaEditar,
  onActualizacion,
}: {
  actividadParaEditar?: Actividad;
  onActualizacion: () => void;
}) {
  return (
    <RegistroActividadesContent
      actividadParaEditar={actividadParaEditar}
      onActualizacion={onActualizacion}
    />
  );
}

function RegistroActividadesContent({
  actividadParaEditar,
  onActualizacion,
}: {
  actividadParaEditar?: Actividad;
  onActualizacion: () => void;
}) {
  const [actividad, setActividad] = useState<Actividad>({
    id: "",
    fecha: new Date().toISOString().split("T")[0],
    titulo: "",
    area: "",
    descripcion: "",
    duracion: 0,
    observaciones: [],
    estado: "",
  });
  const [nuevaObservacion, setNuevaObservacion] = useState("");

  useEffect(() => {
    if (actividadParaEditar) {
      setActividad(actividadParaEditar);
    }
  }, [actividadParaEditar]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActividad({ ...actividad, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, field: string) => {
    setActividad({ ...actividad, [field]: value });
  };

  const agregarObservacion = () => {
    if (nuevaObservacion.trim() !== "") {
      setActividad({
        ...actividad,
        observaciones: [...actividad.observaciones, nuevaObservacion.trim()],
      });
      setNuevaObservacion("");
    }
  };

  const guardarActividad = () => {
    const actividades = JSON.parse(localStorage.getItem("actividades") || "[]");
    if (actividad.id) {
      const index = actividades.findIndex(
        (act: Actividad) => act.id === actividad.id
      );
      if (index !== -1) {
        actividades[index] = actividad;
      }
    } else {
      actividad.id = uuidv4();
      actividades.push(actividad);
    }
    localStorage.setItem("actividades", JSON.stringify(actividades));
    onActualizacion();
    setActividad({
      id: "",
      fecha: new Date().toISOString().split("T")[0],
      titulo: "",
      area: "",
      descripcion: "",
      duracion: 0,
      observaciones: [],
      estado: "",
    });
  };

  return (
    <Card className="w-full max-w-3xl px-8 bg-white dark:bg-[#1a4d4d] text-gray-900 dark:text-white">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold text-center">
          {actividad.id ? "Editar Actividad" : "Registrar Actividad"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título de la Actividad</Label>
          <Input
            id="titulo"
            value={actividad.titulo}
            onChange={handleInputChange}
            placeholder="Ingrese el título"
            className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área</Label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "area")}
            value={actividad.area}
          >
            <SelectTrigger className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b]">
              <SelectValue placeholder="Seleccione el área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administración">Administración</SelectItem>
              <SelectItem value="Sistemas">Sistemas</SelectItem>
              <SelectItem value="RR.HH.">RR.HH.</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={actividad.descripcion}
            onChange={handleInputChange}
            placeholder="Ingrese la descripción"
            className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b] resize-none"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duracion">Duración Estimada (horas)</Label>
          <Input
            id="duracion"
            value={actividad.duracion}
            onChange={handleInputChange}
            type="number"
            placeholder="Ingrese la duración"
            className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="observacion">Observaciones</Label>
          <div className="flex space-x-2">
            <Input
              id="observacion"
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              placeholder="Ingrese una observación"
              className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b] flex-grow"
            />
            <Button
              onClick={agregarObservacion}
              className="bg-gray-200 dark:bg-[#3d6b6b] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#4d7b7b]"
            >
              Agregar
            </Button>
          </div>
          <ul className="list-disc list-inside mt-2">
            {actividad.observaciones.map((obs, index) => (
              <li key={index} className="text-sm">
                {obs}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "estado")}
            value={actividad.estado}
          >
            <SelectTrigger className="bg-gray-100 dark:bg-[#2a5a5a] border-gray-300 dark:border-[#3d6b6b]">
              <SelectValue placeholder="Seleccione el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En Proceso">En Proceso</SelectItem>
              <SelectItem value="Culminado">Culminado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={guardarActividad}
          className="w-full bg-gray-200 dark:bg-[#3d6b6b] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#4d7b7b]"
        >
          {actividad.id ? "Actualizar Actividad" : "Registrar Actividad"}
        </Button>
      </CardFooter>
    </Card>
  );
}
