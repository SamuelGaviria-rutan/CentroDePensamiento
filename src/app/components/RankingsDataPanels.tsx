import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ExpandablePanel } from "./ExpandablePanel"

gsap.registerPlugin(ScrollTrigger)

const FONT =
  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif"
const YEARS = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
]
const ESTIMATED_YEARS = new Set([2021, 2023])
const CHART_COLORS = {
  measured: "#0068ff",
  comparison: "#d93a0a",
  estimated: "#a86400",
  base: "#9aa9a2",
}

const CIMI_SCORE = [
  51.73, 61.49, 59.91, 39.53, 40.67, 43.81, 38.87, 33.93, 33.57, 33.21, 28.94,
  33.92,
]
const CIMI_RANK = [107, 99, 96, 129, 134, 126, 132, 138, 138, 137, 147, 138]
const STARTUP_SCORE = [
  null,
  null,
  null,
  null,
  7.895,
  2.359,
  2.627,
  3.989,
  3.75,
  3.886,
  5.504,
  7.218,
]
const STARTUP_RANK = [
  null,
  null,
  null,
  null,
  107,
  131,
  183,
  205,
  168,
  162,
  145,
  130,
]

const CIMI_DIMENSIONS = [
  {
    key: "economicos",
    label: "Económicos",
    color: "#0068ff",
    values: [69, 66, 85, 132, 140, 115, 115, 115, 112, 109, 159, 130],
  },
  {
    key: "capitalHumano",
    label: "Capital humano",
    color: "#00b8a3",
    values: [123, 175, 138, 128, 132, 132, 139, 146, 147, 148, 151, 132],
  },
  {
    key: "cohesionSocial",
    label: "Cohesión social",
    color: "#ff4c17",
    values: [107, 73, 107, 124, 143, 140, 148, 155, 152, 149, 145, 151],
  },
  {
    key: "medioAmbiente",
    label: "Medio ambiente",
    color: "#ffca00",
    values: [78, 94, 94, 71, 114, 110, 102, 95, 97, 99, 124, 119],
  },
  {
    key: "gobierno",
    label: "Gobierno",
    color: "#c0d400",
    values: [78, 63, 72, 116, 113, 99, 118, 138, 140, 142, 137, 131],
  },
  {
    key: "planeacion",
    label: "Planeación urbana",
    color: "#8a6bff",
    values: [132, 128, 101, 126, 87, 141, 156, 172, 174, 176, 144, 131],
  },
  {
    key: "perfil",
    label: "Perfil internacional",
    color: "#5f8f80",
    values: [107, 128, 114, 113, 155, 142, 145, 148, 145, 142, 160, 128],
  },
  {
    key: "tecnologia",
    label: "Tecnología",
    color: "#ff8fb0",
    values: [95, 84, 67, 153, 143, 136, 141, 146, 149, 152, 137, 135],
  },
  {
    key: "movilidad",
    label: "Movilidad y transporte",
    color: "#8a98a0",
    values: [107, 83, 61, 121, 107, 78, 110, 141, 142, 142, 140, 138],
  },
] as const

const cimiSeries = YEARS.map((year, index) => ({
  year,
  score: CIMI_SCORE[index],
  scoreMeasured: ESTIMATED_YEARS.has(year) ? null : CIMI_SCORE[index],
  rank: CIMI_RANK[index],
  rankMeasured: ESTIMATED_YEARS.has(year) ? null : CIMI_RANK[index],
  rankEstimate: index >= 5 && index <= 9 ? CIMI_RANK[index] : null,
  scoreEstimate: index >= 5 && index <= 9 ? CIMI_SCORE[index] : null,
  estimated: ESTIMATED_YEARS.has(year),
}))

const startupSeries = YEARS.map((year, index) => ({
  year,
  score: STARTUP_SCORE[index],
  rank: STARTUP_RANK[index],
}))

const dimensionSeries = YEARS.map((year, index) => ({
  year,
  estimated: ESTIMATED_YEARS.has(year),
  ...Object.fromEntries(
    CIMI_DIMENSIONS.map((dimension) => [
      dimension.key,
      dimension.values[index],
    ]),
  ),
}))

const distributionSeries = YEARS.map((year, index) => {
  const total = CIMI_DIMENSIONS.reduce(
    (sum, dimension) => sum + dimension.values[index],
    0,
  )
  return {
    year: ESTIMATED_YEARS.has(year) ? `${year} est.` : String(year),
    ...Object.fromEntries(
      CIMI_DIMENSIONS.map((dimension) => [
        dimension.key,
        Number(((dimension.values[index] / total) * 100).toFixed(2)),
      ]),
    ),
    ...Object.fromEntries(
      CIMI_DIMENSIONS.map((dimension) => [
        `${dimension.key}Raw`,
        dimension.values[index],
      ]),
    ),
  }
})

const GEIAL_KPIS = [
  {
    title: "ICEC · condiciones del ecosistema",
    value: 63,
    year: "Edición 2026 (medición 2025)",
    detail: "Nivel 8 de 20 · +1 frente a la medición 2023 (62)",
  },
  {
    title: "IPE · avance en dos años",
    value: 82,
    year: "Edición 2026",
    detail: "Puesto 1 de 21 · +24 frente a 2024 (58)",
  },
  {
    title: "Emprendimiento femenino",
    value: 41,
    year: "Edición 2026",
    detail: "Puesto 4 entre los grandes · −11 frente a 2024 (52)",
  },
  {
    title: "Empresas de base científico-tecnológica",
    value: 59,
    year: "Edición 2026",
    detail: "Puesto 3 entre los grandes · +22 frente a 2024 (37)",
  },
  {
    title: "Adopción de IA",
    value: 71,
    year: "Edición 2026 · primera medición",
    detail: "Puesto 1 entre los grandes · nivel 6 de 20",
  },
]

const GEIAL_HISTORY = [
  { edition: "2024", icec: 62, icecRepeated: null, ipe: 58 },
  { edition: "2025", icec: 63, icecRepeated: null, ipe: null },
  { edition: "2026", icec: null, icecRepeated: 63, ipe: 82 },
]

const GEIAL_PROFILES = [
  { name: "Emprendimiento femenino", edition2024: 52, edition2026: 41 },
  {
    name: "Empresas de base científico-tecnológica",
    edition2024: 37,
    edition2026: 59,
  },
  { name: "Adopción de IA", edition2024: null, edition2026: 71 },
]

const GEIAL_DIMENSIONS = [
  { name: "Capital humano emprendedor", edition2024: 59, edition2026: 59 },
  { name: "Formación emprendedora", edition2024: 62, edition2026: 64 },
  { name: "Cultura emprendedora", edition2024: 68, edition2026: 71 },
  { name: "Condiciones de la demanda", edition2024: 65, edition2026: 64 },
  { name: "Empresas y oportunidades", edition2024: 69, edition2026: 69 },
  {
    name: "Plataforma de CTI y oportunidades",
    edition2024: 64,
    edition2026: 66,
  },
  { name: "Capital social y redes", edition2024: 67, edition2026: 63 },
  { name: "Apoyo institucional", edition2024: 63, edition2026: 65 },
  { name: "Financiamiento", edition2024: 51, edition2026: 52 },
  { name: "Políticas y regulaciones", edition2024: 51, edition2026: 56 },
  { name: "Articulación y gobernanza", edition2024: 63, edition2026: 66 },
]

const GEIAL_FORCES = [
  { name: "Empresas", edition2024: 74, edition2026: 100 },
  { name: "Inversionistas", edition2024: 70, edition2026: 88 },
  { name: "Emprendedores", edition2024: 65, edition2026: 90 },
  { name: "Instituciones y redes", edition2024: 54, edition2026: 82 },
  { name: "Articulación y gobernanza", edition2024: 49, edition2026: 83 },
  { name: "Gobiernos", edition2024: 42, edition2026: 55 },
]

const WOMEN_ENTREPRENEURSHIP = [
  ["Mujeres empresarias que son modelo de rol", 69],
  ["Perspectiva de género en políticas y programas públicos", 57],
  ["Perspectiva de género en organizaciones de apoyo", 51],
  ["Vocación de crecimiento de las mujeres emprendedoras", 46],
  ["Acceso igualitario a redes de contacto", 34],
  ["Obstáculos culturales para relacionarse", 30],
  ["Acceso igualitario a financiamiento", 28],
  ["Mayor carga de tareas de cuidado", 16],
] as const

const AI_ADOPTION = [
  ["Condiciones habilitantes", 76],
  ["Uso y madurez de la adopción", 45],
  ["Logros y resultados", 82],
  ["Nuevas empresas basadas en IA", 80],
] as const

const EBCT = [
  ["Avances en el apoyo a la creación", 47, 76],
  ["Incentivos y apoyos en universidades y centros de I+D", 37, 56],
  ["Ambiente para la creación (general en 2024, externo en 2026)", 29, 49],
] as const

const axisTick = { fill: "#53645E", fontSize: 10, fontFamily: FONT }
const NUMERIC_Y_AXIS_WIDTH = 48
const NUMERIC_CHART_LEFT_MARGIN = 0
const formatNumber = (
  value: number,
  maximumFractionDigits = 0,
  minimumFractionDigits = 0,
) =>
  new Intl.NumberFormat("es-CO", {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)

type TooltipEntry = {
  color?: string
  dataKey?: string
  name?: string
  value?: number | null
  payload?: Record<string, number | string | boolean>
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  hideSeries = false,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  formatter: (value: number, entry: TooltipEntry) => string
  hideSeries?: boolean
}) {
  const visible = payload?.filter(
    (entry) => entry.value !== null && entry.value !== undefined,
  )
  if (!active || !visible?.length) return null

  return (
    <div
      className="rounded-[6px] bg-black/80 px-2 py-1.5 text-xs text-white shadow-lg"
      style={{ fontFamily: FONT }}
    >
      <p className="mb-1.5 font-bold">{label}</p>
      <div className="space-y-1">
        {visible.map((entry) => (
          <div
            key={`${entry.dataKey}-${entry.name}`}
            className="flex items-center gap-2"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {hideSeries ? "" : `${entry.name}: `}
              {formatter(Number(entry.value), entry)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StackTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
}) {
  const visible = payload?.filter(
    (entry) => entry.value !== null && entry.value !== undefined,
  )
  if (!active || !visible?.length) return null
  const sum = visible.reduce(
    (total, entry) =>
      total + Number(entry.payload?.[`${entry.dataKey}Raw`] ?? 0),
    0,
  )

  return (
    <div
      className="max-w-[310px] rounded-[6px] bg-black/80 px-2 py-1.5 text-xs text-white shadow-lg"
      style={{ fontFamily: FONT }}
    >
      <p className="mb-1.5 font-bold">{label}</p>
      <div className="space-y-1">
        {visible.map((entry) => (
          <div key={entry.dataKey} className="flex items-start gap-2">
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: {formatNumber(Number(entry.value), 1)} % · puesto{" "}
              {formatNumber(Number(entry.payload?.[`${entry.dataKey}Raw`]))}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 border-t border-white/20 pt-1.5 font-bold">
        Suma de puestos: {formatNumber(sum)}
      </p>
    </div>
  )
}

interface LegendItem {
  label: string
  color: string
  dashed?: boolean
  outlined?: boolean
}

function LegendItems({ items }: { items: LegendItem[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-[#253D36]/65">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <i
            aria-hidden="true"
            className="h-2.5 w-4 rounded-[1px]"
            style={{
              background: item.outlined ? "#FFFFFF" : item.color,
              border: item.outlined ? `2px solid ${item.color}` : undefined,
              backgroundImage: item.dashed
                ? `repeating-linear-gradient(90deg, ${item.color} 0 4px, transparent 4px 7px)`
                : undefined,
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  description,
  accent = "#00B8A3",
  className = "",
  children,
}: {
  title: string
  description?: string
  accent?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <article
      data-ranking-card
      className={`relative min-w-0 overflow-hidden rounded-[2px] border border-[#253D36]/10 bg-white p-4 shadow-[0_14px_36px_rgba(37,61,54,0.06)] sm:p-7 ${className}`}
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <h3 className="text-lg font-black leading-tight text-[#253D36]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-[#253D36]/65">
          {description}
        </p>
      )}
      {children}
    </article>
  )
}

function RankingLineChart({
  data,
  valueKey,
  measuredKey,
  estimateKey,
  reversed = false,
  label,
  seriesName,
  valueFormatter,
}: {
  data: Record<string, unknown>[]
  valueKey: string
  measuredKey?: string
  estimateKey?: string
  reversed?: boolean
  label: string
  seriesName: string
  valueFormatter: (value: number) => string
}) {
  return (
    <div role="img" aria-label={label} className="mt-5 h-60 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 12,
            right: 14,
            left: NUMERIC_CHART_LEFT_MARGIN,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="rgba(37,61,54,0.10)"
            vertical={false}
            strokeDasharray="3 5"
          />
          <XAxis
            dataKey="year"
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            minTickGap={18}
          />
          <YAxis
            reversed={reversed}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            width={NUMERIC_Y_AXIS_WIDTH}
          />
          <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
          {estimateKey && (
            <Line
              type="linear"
              dataKey={estimateKey}
              name="Estimación"
              stroke={CHART_COLORS.estimated}
              strokeWidth={2}
              strokeDasharray="3 5"
              dot={{
                r: 4,
                fill: "#FFFFFF",
                stroke: CHART_COLORS.estimated,
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={false}
            />
          )}
          <Line
            type="linear"
            dataKey={measuredKey ?? valueKey}
            name={seriesName}
            stroke={CHART_COLORS.measured}
            strokeWidth={3}
            dot={{
              r: 4,
              fill: CHART_COLORS.measured,
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: CHART_COLORS.measured,
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface GroupedBarDatum {
  name: string
  edition2024: number | null
  edition2026: number
}

function GroupedHorizontalBars({
  data,
  height,
  ariaLabel,
}: {
  data: GroupedBarDatum[]
  height: number
  ariaLabel: string
}) {
  return (
    <div role="img" aria-label={ariaLabel} className="mt-5 w-full">
      <div className="space-y-5 sm:hidden">
        {data.map((item) => (
          <div key={item.name}>
            <p className="text-sm font-bold leading-snug text-[#253D36]">
              {item.name}
            </p>
            <div className="mt-2 grid grid-cols-[3.75rem_minmax(0,1fr)_1.75rem] items-center gap-2 text-[10px] font-bold text-[#253D36]/60">
              <span>2024</span>
              <div className="h-2 bg-[#253D36]/10">
                {item.edition2024 !== null && (
                  <div
                    className="h-full"
                    style={{
                      width: `${item.edition2024}%`,
                      backgroundColor: CHART_COLORS.base,
                    }}
                  />
                )}
              </div>
              <span className="text-right text-[#253D36]">
                {item.edition2024 ?? "—"}
              </span>
              <span>2026</span>
              <div className="h-2 bg-[#253D36]/10">
                <div
                  className="h-full"
                  style={{
                    width: `${item.edition2026}%`,
                    backgroundColor: CHART_COLORS.measured,
                  }}
                />
              </div>
              <span className="text-right text-[#253D36]">
                {item.edition2026}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 32, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(37,61,54,0.10)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<ChartTooltip formatter={(value) => String(value)} />}
            />
            <Bar
              dataKey="edition2024"
              name="Edición 2024"
              fill={CHART_COLORS.base}
              maxBarSize={14}
              radius={[0, 2, 2, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="edition2024"
                position="right"
                style={{ fill: "#253D36", fontSize: 10, fontWeight: 700 }}
              />
            </Bar>
            <Bar
              dataKey="edition2026"
              name="Edición 2026"
              fill={CHART_COLORS.measured}
              maxBarSize={14}
              radius={[0, 2, 2, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="edition2026"
                position="right"
                style={{ fill: "#253D36", fontSize: 10, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ProgressRows({
  rows,
  color = "#0068FF",
}: {
  rows: ReadonlyArray<readonly [string, number]>
  color?: string
}) {
  return (
    <div className="mt-5 space-y-4">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[minmax(0,1fr)_2.25rem] gap-x-3 gap-y-2"
        >
          <span className="text-sm font-bold leading-snug text-[#253D36]">
            {label}
          </span>
          <span className="text-right text-sm font-black tabular-nums text-[#253D36]">
            {value}
          </span>
          <div className="col-span-2 h-2 overflow-hidden rounded-[2px] bg-[#253D36]/10">
            <div
              className="h-full rounded-[2px]"
              style={{ width: `${value}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function CimiStartupSection() {
  return (
    <section
      id="rankings-internacionales"
      className="bg-[#F2F4F0] pb-3 pt-6 sm:pt-8"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-12">
        <div className="mb-6 max-w-3xl sm:mb-8">
          <p className="text-sm leading-relaxed text-[#253D36]/65 sm:text-base">
            Selecciona la organización y conoce la posición de Medellín en
            escenarios locales y globales
          </p>
        </div>
        <ExpandablePanel id="rankings-cimi" title="CIMI">
          <div className="pt-8 sm:pt-10">
            <div className="max-w-4xl">
              <h2 className="text-[1.75rem] font-black tracking-tight text-[#253D36] sm:text-3xl md:text-5xl">
                CIMI y StartupBlink: posición en rankings internacionales
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#253D36]/70 sm:mt-5 sm:text-base md:text-lg">
                En los puestos, un número menor es mejor: el eje está invertido
                y subir en la gráfica es mejorar. Los años sin medición quedan
                como hueco, no como cero. Los puntos huecos con línea punteada
                son estimaciones de los años sin medición (2021 y 2023), no
                datos medidos.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:mt-9 sm:gap-6 lg:grid-cols-2">
              <ChartCard title="CIMI · puesto de Medellín" accent="#0068FF">
                <RankingLineChart
                  data={cimiSeries}
                  valueKey="rank"
                  measuredKey="rankMeasured"
                  estimateKey="rankEstimate"
                  reversed
                  seriesName="CIMI · puesto"
                  valueFormatter={(value) => `Puesto ${formatNumber(value)}`}
                  label="Puesto de Medellín en el CIMI entre 2015 y 2026, incluyendo estimaciones para 2021 y 2023."
                />
                <LegendItems
                  items={[
                    { label: "Medido", color: CHART_COLORS.measured },
                    {
                      label: "Estimación (años sin medición)",
                      color: CHART_COLORS.estimated,
                      dashed: true,
                    },
                  ]}
                />
                <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                  Estimación por interpolación lineal entre la medición anterior
                  y la siguiente. No son datos medidos. 2021: Puesto 132 · 2023:
                  Puesto 138.
                </p>
              </ChartCard>
              <ChartCard title="CIMI · puntaje" accent="#00B8A3">
                <RankingLineChart
                  data={cimiSeries}
                  valueKey="score"
                  measuredKey="scoreMeasured"
                  estimateKey="scoreEstimate"
                  seriesName="CIMI · puntaje"
                  valueFormatter={(value) => formatNumber(value, 2, 2)}
                  label="Puntaje de Medellín en el CIMI entre 2015 y 2026, incluyendo estimaciones para 2021 y 2023."
                />
                <LegendItems
                  items={[
                    { label: "Medido", color: CHART_COLORS.measured },
                    {
                      label: "Estimación (años sin medición)",
                      color: CHART_COLORS.estimated,
                      dashed: true,
                    },
                  ]}
                />
                <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                  Estimación por interpolación lineal entre la medición anterior
                  y la siguiente. No son datos medidos. 2021: 38,87 · 2023:
                  33,57.
                </p>
              </ChartCard>
            </div>

            <ChartCard
              title="CIMI · distribución por dimensión (100 %)"
              description="Todas las barras valen 100 %. Cada segmento es la parte que aporta una dimensión a la suma de los nueve puestos del año. Un segmento más grande indica la dimensión donde Medellín está relativamente más lejos en ese año."
              accent="#C0D400"
              className="mt-6"
            >
              <div
                role="img"
                aria-label="Distribución porcentual de los nueve puestos CIMI por dimensión y año."
                className="mt-6 h-[320px] w-full sm:h-[420px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionSeries}
                    margin={{
                      top: 6,
                      right: 6,
                      left: NUMERIC_CHART_LEFT_MARGIN,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      stroke="rgba(37,61,54,0.08)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="year"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                      width={NUMERIC_Y_AXIS_WIDTH}
                    />
                    <Tooltip content={<StackTooltip />} />
                    {CIMI_DIMENSIONS.map((dimension) => (
                      <Bar
                        key={dimension.key}
                        dataKey={dimension.key}
                        stackId="distribution"
                        fill={dimension.color}
                        name={dimension.label}
                        isAnimationActive={false}
                      >
                        {distributionSeries.map((entry) => (
                          <Cell
                            key={entry.year}
                            fill={
                              entry.year.includes("est.")
                                ? `${dimension.color}80`
                                : dimension.color
                            }
                          />
                        ))}
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <LegendItems
                items={CIMI_DIMENSIONS.map((dimension) => ({
                  label: dimension.label,
                  color: dimension.color,
                }))}
              />
              <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                Las barras identificadas con «est.» (2021 y 2023) son
                estimaciones por interpolación lineal de cada dimensión, no
                datos medidos.
              </p>
            </ChartCard>

            <h3 className="mt-9 text-2xl font-black text-[#253D36] sm:mt-12">
              CIMI por dimensión (puesto)
            </h3>
            <div className="mobile-swipe-rail -mx-6 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3">
              {CIMI_DIMENSIONS.map((dimension) => {
                const change = dimension.values[11] - dimension.values[10]
                return (
                  <ChartCard
                    key={dimension.key}
                    title={dimension.label}
                    accent={dimension.color}
                    className="mobile-swipe-item p-5 sm:w-auto sm:p-5"
                  >
                    <p className="mt-2 text-xs font-bold leading-relaxed text-[#253D36]/65">
                      Puesto {dimension.values[11]} en 2026 ·{" "}
                      {change < 0
                        ? `▲ mejoró ${Math.abs(change)}`
                        : change > 0
                          ? `▼ bajó ${change}`
                          : "sin cambio"}{" "}
                      puestos frente a 2025
                    </p>
                    <div
                      role="img"
                      aria-label={`Puesto CIMI de ${dimension.label} entre 2015 y 2026.`}
                      className="mt-4 h-40"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dimensionSeries}
                          margin={{
                            top: 8,
                            right: 8,
                            left: NUMERIC_CHART_LEFT_MARGIN,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            stroke="rgba(37,61,54,0.08)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="year"
                            ticks={[2015, 2020, 2026]}
                            tick={axisTick}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            reversed
                            tick={axisTick}
                            axisLine={false}
                            tickLine={false}
                            width={NUMERIC_Y_AXIS_WIDTH}
                          />
                          <Tooltip
                            content={
                              <ChartTooltip
                                hideSeries
                                formatter={(value) =>
                                  `Puesto ${formatNumber(value)}`
                                }
                              />
                            }
                          />
                          <Line
                            type="linear"
                            dataKey={dimension.key}
                            name={dimension.label}
                            stroke={CHART_COLORS.measured}
                            strokeWidth={2.5}
                            dot={{
                              r: 2.5,
                              fill: CHART_COLORS.measured,
                              strokeWidth: 0,
                            }}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                )
              })}
            </div>
          </div>
        </ExpandablePanel>
        <ExpandablePanel
          id="rankings-startupblink"
          title="StartupBlink"
          className="mt-2"
        >
          <div className="pb-1">
            <h3 className="mt-9 text-2xl font-black text-[#253D36] sm:mt-12">
              StartupBlink
            </h3>
            <div className="mt-5 grid gap-4 sm:gap-6 lg:grid-cols-2">
              <ChartCard title="Puesto en el mundo" accent="#FF4C17">
                <RankingLineChart
                  data={startupSeries}
                  valueKey="rank"
                  reversed
                  seriesName="StartupBlink · puesto mundial"
                  valueFormatter={(value) => `Puesto ${formatNumber(value)}`}
                  label="Puesto mundial de Medellín en StartupBlink entre 2019 y 2026."
                />
              </ChartCard>
              <ChartCard title="Puntaje" accent="#FFCA00">
                <RankingLineChart
                  data={startupSeries}
                  valueKey="score"
                  seriesName="StartupBlink · puntaje"
                  valueFormatter={(value) => formatNumber(value, 3, 3)}
                  label="Puntaje de Medellín en StartupBlink entre 2019 y 2026."
                />
              </ChartCard>
            </div>
          </div>
        </ExpandablePanel>
      </div>
    </section>
  )
}

function GeialSection() {
  return (
    <section id="rankings-geial" className="bg-[#F2F4F0] pb-3">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-12">
        <ExpandablePanel id="rankings-geial-panel" title="GEIAL">
          <div className="pt-8 sm:pt-10">
            <div className="max-w-4xl">
              <h2 className="text-[1.75rem] font-black tracking-tight text-[#253D36] sm:text-3xl md:text-5xl">
                GEIAL: Medellín entre los ecosistemas de América Latina
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#253D36]/70 sm:mt-5 sm:text-base md:text-lg">
                Resultados de las ediciones 2024, 2025 y 2026 del reporte del
                Grupo de Ecosistemas Inteligentes de América Latina. Todos los
                puntajes van de 0 a 100. El ICEC mide las condiciones del
                ecosistema (la «foto») y el IPE mide su avance en los últimos
                dos años (la «película»).
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-4 xl:grid-cols-5">
              {GEIAL_KPIS.map((kpi) => (
                <article
                  key={kpi.title}
                  data-ranking-card
                  className="border-t-4 border-[#C0D400] bg-[#F2F4F0] p-4 sm:p-5"
                >
                  <h3 className="text-[11px] font-black uppercase tracking-[0.06em] text-[#253D36]/70 sm:min-h-12 sm:text-xs">
                    {kpi.title}
                  </h3>
                  <p className="mt-3 text-3xl font-black tracking-tight text-[#253D36] sm:mt-4 sm:text-4xl">
                    {kpi.value}
                    <span className="ml-1 text-xs text-[#253D36]/45 sm:text-sm">
                      / 100
                    </span>
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#0068FF]">
                    {kpi.year}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#253D36]/60">
                    {kpi.detail}
                  </p>
                </article>
              ))}
            </div>

            <h3 className="mt-9 text-2xl font-black text-[#253D36] sm:mt-12">
              Histórico por edición
            </h3>
            <div className="mt-5 grid gap-4 sm:gap-6 lg:grid-cols-2">
              <ChartCard title="ICEC e IPE de Medellín" accent="#0068FF">
                <div
                  role="img"
                  aria-label="ICEC e IPE de Medellín en las ediciones GEIAL 2024, 2025 y 2026."
                  className="mt-5 h-[280px] sm:h-[340px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={GEIAL_HISTORY}
                      margin={{
                        top: 20,
                        right: 20,
                        left: NUMERIC_CHART_LEFT_MARGIN,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        stroke="rgba(37,61,54,0.10)"
                        vertical={false}
                        strokeDasharray="3 5"
                      />
                      <XAxis
                        dataKey="edition"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[40, 100]}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        width={NUMERIC_Y_AXIS_WIDTH}
                      />
                      <Tooltip
                        content={
                          <ChartTooltip formatter={(value) => String(value)} />
                        }
                      />
                      <Line
                        type="linear"
                        dataKey="icec"
                        name="ICEC"
                        stroke={CHART_COLORS.measured}
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: CHART_COLORS.measured,
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                        }}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey="icec"
                          position="top"
                          style={{
                            fill: "#253D36",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        />
                      </Line>
                      <Line
                        type="linear"
                        dataKey="icecRepeated"
                        name="ICEC (repite 2025)"
                        stroke="transparent"
                        dot={{
                          r: 5,
                          fill: "#FFFFFF",
                          stroke: CHART_COLORS.estimated,
                          strokeWidth: 2.5,
                        }}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey="icecRepeated"
                          position="top"
                          style={{
                            fill: "#253D36",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        />
                      </Line>
                      <Line
                        type="linear"
                        dataKey="ipe"
                        name="IPE"
                        stroke={CHART_COLORS.comparison}
                        strokeWidth={3}
                        connectNulls
                        dot={{
                          r: 4,
                          fill: CHART_COLORS.comparison,
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                        }}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey="ipe"
                          position="top"
                          style={{
                            fill: "#253D36",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <LegendItems
                  items={[
                    {
                      label: "ICEC · condiciones",
                      color: CHART_COLORS.measured,
                    },
                    { label: "IPE · avance", color: CHART_COLORS.comparison },
                    {
                      label: "Valor repetido de 2025, no es medición nueva",
                      color: CHART_COLORS.estimated,
                      outlined: true,
                    },
                  ]}
                />
                <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                  El ICEC de 2026 repite el de 2025: el reporte 2026 usa la
                  misma medición de condiciones y suma un IPE nuevo. La edición
                  2025 no midió IPE, por eso la línea del IPE va de 2024 a 2026.
                </p>
              </ChartCard>
              <ChartCard title="Perfiles temáticos" accent="#00B8A3">
                <GroupedHorizontalBars
                  data={GEIAL_PROFILES}
                  height={340}
                  ariaLabel="Puntajes de emprendimiento femenino, empresas de base científico-tecnológica y adopción de IA en 2024 y 2026."
                />
                <LegendItems
                  items={[
                    { label: "Edición 2024", color: CHART_COLORS.base },
                    { label: "Edición 2026", color: CHART_COLORS.measured },
                  ]}
                />
                <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                  La adopción de IA se midió por primera vez en 2026. Las
                  ediciones comparan grupos de ecosistemas distintos, así que
                  las diferencias sirven de orientación y no como una variación
                  exacta.
                </p>
              </ChartCard>
            </div>

            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
              <ChartCard title="ICEC por dimensión" accent="#C0D400">
                <GroupedHorizontalBars
                  data={GEIAL_DIMENSIONS}
                  height={520}
                  ariaLabel="ICEC por dimensión en la medición 2023 y en las ediciones 2025 y 2026."
                />
                <LegendItems
                  items={[
                    {
                      label: "Edición 2024 (medición 2023)",
                      color: CHART_COLORS.base,
                    },
                    {
                      label: "Edición 2025 y 2026",
                      color: CHART_COLORS.measured,
                    },
                  ]}
                />
              </ChartCard>
              <ChartCard title="IPE por fuerza dinamizadora" accent="#FFCA00">
                <GroupedHorizontalBars
                  data={GEIAL_FORCES}
                  height={420}
                  ariaLabel="IPE por fuerza dinamizadora en 2024 y 2026."
                />
                <LegendItems
                  items={[
                    { label: "Edición 2024", color: CHART_COLORS.base },
                    { label: "Edición 2026", color: CHART_COLORS.measured },
                  ]}
                />
                <p className="mt-3 text-xs leading-relaxed text-[#253D36]/55">
                  Las seis fuerzas subieron. Gobiernos sigue siendo la más baja
                  (55), con avance incipiente.
                </p>
              </ChartCard>
            </div>

            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
              <ChartCard
                title="Emprendimiento femenino dinámico, 2026"
                description="Puntaje por variable. Un puntaje bajo señala una condición que frena el emprendimiento de las mujeres."
                accent="#FF4C17"
              >
                <ProgressRows
                  rows={WOMEN_ENTREPRENEURSHIP}
                  color={CHART_COLORS.measured}
                />
              </ChartCard>
              <ChartCard
                title="Adopción de IA y EBCT, 2026"
                description="Dimensiones de adopción de IA (71 en total) y de condiciones para empresas de base científico-tecnológica (59 en total)."
                accent="#0068FF"
              >
                <h4 className="mt-6 text-sm font-black uppercase tracking-[0.08em] text-[#253D36]">
                  Adopción de IA
                </h4>
                <ProgressRows
                  rows={AI_ADOPTION}
                  color={CHART_COLORS.measured}
                />
                <div className="my-7 border-t border-[#253D36]/10" />
                <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[#253D36]">
                  EBCT (con el puntaje de 2024 al lado)
                </h4>
                <div className="mt-5 space-y-4">
                  {EBCT.map(([label, previousValue, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(0,1fr)_2.25rem] gap-x-3 gap-y-2"
                    >
                      <span className="text-sm font-bold leading-snug text-[#253D36]">
                        {label}
                        <span className="ml-2 inline-block rounded-[2px] bg-[#253D36]/10 px-2 py-0.5 text-[10px] font-black text-[#253D36]/65">
                          2024: {previousValue}
                        </span>
                      </span>
                      <span className="text-right text-sm font-black tabular-nums text-[#253D36]">
                        {value}
                      </span>
                      <div className="col-span-2 h-2 overflow-hidden rounded-[2px] bg-[#253D36]/10">
                        <div
                          className="h-full rounded-[2px]"
                          style={{
                            width: `${value}%`,
                            backgroundColor: CHART_COLORS.measured,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>
        </ExpandablePanel>
      </div>
    </section>
  )
}

export function RankingsDataPanels() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-ranking-card]",
          root,
        )
        cards.forEach((card) => {
          gsap.fromTo(card, { y: 24, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          })
        })
      })
      return () => media.revert()
    }, root)

    return () => context.revert()
  }, [])

  return (
    <div ref={rootRef} style={{ fontFamily: FONT }}>
      <CimiStartupSection />
      <GeialSection />
    </div>
  )
}
