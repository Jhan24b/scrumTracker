"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Actividad {
  id: string;
  fecha: string;
  titulo: string;
  area: string;
  descripcion: string;
  duracion: number;
  observaciones: string[];
  estado: "Pendiente" | "En Proceso" | "Culminado";
}

const areaColors = {
  Administración: "bg-blue-100 dark:bg-blue-900",
  Sistemas: "bg-green-100 dark:bg-green-900",
  "RR.HH.": "bg-yellow-100 dark:bg-yellow-900",
  Ventas: "bg-red-100 dark:bg-red-900",
  Soporte: "bg-purple-100 dark:bg-purple-900",
};

const estadoColors = {
  Pendiente: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  "En Proceso": "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
  Culminado:
    "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200",
};

export default function ProjectView() {
  const [actividades, setActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    const storedActividades = localStorage.getItem("actividades");
    if (storedActividades) {
      setActividades(JSON.parse(storedActividades));
    }
  }, []);

  const groupedActividades = actividades.reduce((acc, actividad) => {
    if (!acc[actividad.area]) {
      acc[actividad.area] = {};
    }
    if (!acc[actividad.area][actividad.estado]) {
      acc[actividad.area][actividad.estado] = [];
    }
    acc[actividad.area][actividad.estado].push(actividad);
    return acc;
  }, {} as Record<string, Record<string, Actividad[]>>);

  return (
    <div className="container mx-auto p-8 w-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
        {Object.entries(groupedActividades).map(([area, estados]) => (
          <Card
            key={area}
            className={`${
              areaColors[area as keyof typeof areaColors] ||
              "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <CardHeader>
              <CardTitle>{area}</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(estados).map(([estado, actividades]) => (
                <div key={estado} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{estado}</h3>
                  <ScrollArea className="h-[200px]">
                    {actividades.map((actividad) => (
                      <Card
                        key={actividad.id}
                        className="mb-2 bg-white dark:bg-gray-700"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between w-full">
                            <h4 className="font-medium">{actividad.titulo}</h4>
                            <p className="text-sm text-gray-400">
                              {actividad.duracion + " horas"}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 py-1">
                            {actividad.descripcion}
                          </p>
                          {actividad.observaciones && (
                            <h5 className="text-sm py-1 text-gray-600 dark:text-gray-200">
                              Observaciones
                            </h5>
                          )}
                          {actividad.observaciones.map((obs, index) => (
                            <li
                              key={index}
                              className="text-xs py-2 px-3 my-1 rounded-sm bg-slate-100 dark:bg-slate-600 decoration-transparent"
                            >
                              {obs}
                            </li>
                          ))}
                          <div className="mt-2">
                            <Badge className={estadoColors[actividad.estado]}>
                              {actividad.estado}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
