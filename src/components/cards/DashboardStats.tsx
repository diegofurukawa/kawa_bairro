'use client'

import * as React from 'react'
import { MapPin, Home, Users, Phone, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItemProps {
  icon: React.ElementType
  label: string
  value: number | string
  colorClass: string
  bgClass: string
}

function StatItem({ icon: Icon, label, value, colorClass, bgClass }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className={cn("p-2 rounded-lg", bgClass)}>
        <Icon className={cn("h-5 w-5", colorClass)} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

interface VistoriaStatProps {
  label: string
  value: number
  percentage: number
  colorClass: string
}

function VistoriaStat({ label, value, percentage, colorClass }: VistoriaStatProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", colorClass)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-right text-gray-400">{percentage.toFixed(1)}%</p>
    </div>
  )
}

export interface DashboardStatsProps {
  stats: {
    totalQuadras: number
    totalUnidades: number
    totalMoradores: number
    totalContatos: number
    vistoria: {
      pendente: number
      agendado: number
      remarcado: number
      realizado: number
      reprovada: number
      total: number
      percentages: {
        pendente: number
        agendado: number
        remarcado: number
        realizado: number
        reprovada: number
      }
    }
  }
  className?: string
}

export function DashboardStats({ stats, className }: DashboardStatsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-2 gap-3">
        <StatItem 
          icon={MapPin} 
          label="Quadras" 
          value={stats.totalQuadras} 
          colorClass="text-purple-brand-600" 
          bgClass="bg-purple-brand-50"
        />
        <StatItem 
          icon={Home} 
          label="Unidades" 
          value={stats.totalUnidades} 
          colorClass="text-green-600" 
          bgClass="bg-green-50"
        />
        <StatItem 
          icon={Users} 
          label="Moradores" 
          value={stats.totalMoradores} 
          colorClass="text-purple-600" 
          bgClass="bg-purple-50"
        />
        <StatItem 
          icon={Phone} 
          label="Contatos" 
          value={stats.totalContatos} 
          colorClass="text-orange-600" 
          bgClass="bg-orange-50"
        />
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Vistorias</h3>
        </div>

        <div className="space-y-4">
          <VistoriaStat 
            label="Pendente" 
            value={stats.vistoria.pendente} 
            percentage={stats.vistoria.percentages.pendente} 
            colorClass="bg-gray-400"
          />
          <VistoriaStat 
            label="Agendado" 
            value={stats.vistoria.agendado} 
            percentage={stats.vistoria.percentages.agendado} 
            colorClass="bg-yellow-500"
          />
          <VistoriaStat 
            label="Remarcado" 
            value={stats.vistoria.remarcado} 
            percentage={stats.vistoria.percentages.remarcado} 
            colorClass="bg-orange-500"
          />
          <VistoriaStat 
            label="Reprovada" 
            value={stats.vistoria.reprovada} 
            percentage={stats.vistoria.percentages.reprovada} 
            colorClass="bg-red-500"
          />
          <VistoriaStat 
            label="Realizado" 
            value={stats.vistoria.realizado} 
            percentage={stats.vistoria.percentages.realizado} 
            colorClass="bg-green-500"
          />
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-gray-50 text-sm">
          <span className="text-gray-500">Total Geral</span>
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {stats.vistoria.total}
          </span>
        </div>
      </div>
    </div>
  )
}
