"use client";

import { useState } from "react";
import { ArrowRight, Loader2, ChevronDown, ChevronUp, ExternalLink, Check } from "lucide-react";

type Difficulty = "fácil" | "normal" | "difícil";

interface RoadmapPhase {
  week: string;
  title: string;
  tasks: string[];
}

interface Project {
  title: string;
  difficulty: Difficulty;
  duration: string;
  description: string;
  techs: string[];
  why: string;
  roadmap: RoadmapPhase[];
}

// ─── Job profiles ────────────────────────────────────────────────────────────

const profiles: Record<string, { role: string; projects: Project[] }> = {
  frontend: {
    role: "Frontend Developer",
    projects: [
      {
        title: "Design System Personal",
        difficulty: "fácil",
        duration: "2–3 semanas",
        description:
          "Crea tu propio design system con componentes reutilizables, tokens de diseño y documentación con Storybook.",
        techs: ["React", "TypeScript", "Storybook", "CSS Modules", "Vitest"],
        why: "Los empleadores de frontend valoran la capacidad de construir componentes consistentes y bien documentados. Demuestra disciplina de ingeniería que va más allá de hacer que algo funcione.",
        roadmap: [
          {
            week: "Semana 1",
            title: "Tokens y base",
            tasks: [
              "Definir paleta de colores y tipografía como CSS variables",
              "Setup de Storybook con addons esenciales",
              "Primeros 3 componentes: Button, Input, Card",
              "Variantes y estados (hover, focus, disabled)",
            ],
          },
          {
            week: "Semana 2",
            title: "Componentes compuestos",
            tasks: [
              "Modal, Dropdown, Toast notification",
              "Sistema de temas light/dark con CSS variables",
              "Tests con Vitest + Testing Library",
              "Documentación de props y ejemplos en Storybook",
            ],
          },
          {
            week: "Semana 3",
            title: "Publicación",
            tasks: [
              "Publicar paquete en npm",
              "Deploy de Storybook en GitHub Pages",
              "README con ejemplos de instalación y uso",
              "Demo app que consume el design system",
            ],
          },
        ],
      },
      {
        title: "Editor de notas tipo Notion",
        difficulty: "normal",
        duration: "5–6 semanas",
        description:
          "Editor de bloques con drag & drop, rich text, y sincronización en tiempo real entre pestañas del navegador.",
        techs: ["React", "TypeScript", "TipTap", "dnd-kit", "Zustand", "BroadcastChannel API"],
        why: "Dominar un editor rico demuestra comprensión de state management complejo y manipulación del DOM. Es exactamente el tipo de feature que diferencia a los candidatos senior.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Editor base",
            tasks: [
              "Setup de TipTap con extensiones de heading, lista, código",
              "Barra de formato flotante contextual",
              "Persistencia en localStorage",
              "Atajos de teclado tipo Notion (/comando)",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Bloques y drag & drop",
            tasks: [
              "Sistema de bloques con dnd-kit",
              "Tipos de bloque: imagen, callout, divider, quote",
              "Sidebar de páginas y navegación entre documentos",
              "Modo de vista previa",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Colaboración y pulido",
            tasks: [
              "Sincronización entre tabs con BroadcastChannel",
              "Exportar a Markdown y HTML",
              "Animaciones de transición fluidas",
              "Deploy en Vercel + README con GIF demo",
            ],
          },
        ],
      },
      {
        title: "Compilador visual de CSS Animations",
        difficulty: "difícil",
        duration: "8–10 semanas",
        description:
          "Editor visual de animaciones CSS con timeline, keyframes editables, curvas de easing y exportación de código limpio.",
        techs: ["React", "TypeScript", "Web Animations API", "Canvas API", "CodeMirror"],
        why: "Demuestra comprensión profunda del browser rendering pipeline. Pocos developers construyen herramientas de este tipo, lo que genera diferenciación absoluta en cualquier proceso de selección.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Timeline base",
            tasks: [
              "Componente Timeline con ruler de tiempo",
              "Playhead arrastrable y control de reproducción",
              "Preview del elemento animado en tiempo real",
              "Research de Web Animations API",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Editor de keyframes",
            tasks: [
              "Panel de propiedades CSS animables",
              "Editor de curvas cubic-bezier visual",
              "Añadir y editar keyframes con drag",
              "Undo/Redo con historial de estados",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Exportación y templates",
            tasks: [
              "Generación de CSS @keyframes optimizado",
              "Templates de animaciones (bounce, fade, slide, elastic)",
              "Import/export de proyectos en JSON",
              "Comparador before/after de la animación",
            ],
          },
          {
            week: "Semana 7–10",
            title: "Ecosistema",
            tasks: [
              "VS Code extension para preview de animaciones",
              "CLI para generar código desde JSON",
              "Documentación completa con ejemplos",
              "Lanzamiento en Product Hunt",
            ],
          },
        ],
      },
    ],
  },
  backend: {
    role: "Backend Developer",
    projects: [
      {
        title: "CLI de gestión de proyectos",
        difficulty: "fácil",
        duration: "2–3 semanas",
        description:
          "Herramienta de terminal para gestionar proyectos, tareas y tiempo con configuración local en TOML y storage en SQLite.",
        techs: ["Node.js", "TypeScript", "Commander.js", "SQLite", "Chalk", "TOML"],
        why: "Los developers de backend usan CLIs constantemente. Construir la tuya propia demuestra que entiendes el ecosistema de herramientas y la experiencia de desarrollador (DX).",
        roadmap: [
          {
            week: "Semana 1",
            title: "Setup y comandos base",
            tasks: [
              "Estructura con Commander.js y subcomandos",
              "Comandos: init, add, list, done, delete",
              "Storage con SQLite (better-sqlite3)",
              "Configuración global en ~/.config/app.toml",
            ],
          },
          {
            week: "Semana 2",
            title: "Features avanzadas",
            tasks: [
              "Tracking de tiempo con start/stop",
              "Reporte de tiempo por proyecto (ASCII chart)",
              "Output con colores (chalk) y spinners (ora)",
              "Filtros, búsqueda y etiquetas",
            ],
          },
          {
            week: "Semana 3",
            title: "Distribución",
            tasks: [
              "Publicar en npm como paquete global",
              "Homebrew tap para instalación en Mac",
              "Tests de integración con Vitest",
              "README con GIF demo grabado con VHS",
            ],
          },
        ],
      },
      {
        title: "API Gateway con observabilidad",
        difficulty: "normal",
        duration: "5–6 semanas",
        description:
          "Proxy API con rate limiting por usuario, circuit breaker, métricas Prometheus y dashboard de observabilidad en Grafana.",
        techs: ["Node.js", "TypeScript", "Redis", "Prometheus", "Grafana", "Docker Compose"],
        why: "Observabilidad y resiliencia son skills top en backend. Este proyecto cubre exactamente los patrones de sistemas distribuidos que se evalúan en entrevistas para roles senior.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Proxy y routing",
            tasks: [
              "HTTP proxy con Fastify",
              "Configuración de upstream services via YAML",
              "Health checks automáticos por upstream",
              "Request/response logging estructurado (JSON)",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Resiliencia",
            tasks: [
              "Rate limiting con Redis sliding window",
              "Circuit breaker con estados closed/open/half-open",
              "Retry con exponential backoff y jitter",
              "Timeout y deadline propagation",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Observabilidad",
            tasks: [
              "Métricas con Prometheus client (latencia, errores, RPS)",
              "Dashboard en Grafana con alertas",
              "Tracing con OpenTelemetry",
              "Runbook de operaciones con ejemplos curl",
            ],
          },
        ],
      },
      {
        title: "Base de datos key-value distribuida",
        difficulty: "difícil",
        duration: "10–12 semanas",
        description:
          "Motor de base de datos key-value distribuido con replicación Raft, Write-Ahead Log y compactación de logs.",
        techs: ["Go", "Protocol Buffers", "gRPC", "Raft consensus", "LSM Tree"],
        why: "Construir storage desde cero es el proyecto que más diferencia a un developer. Demuestra comprensión de sistemas distribuidos a un nivel que muy pocos candidatos alcanzan.",
        roadmap: [
          {
            week: "Semana 1–3",
            title: "Storage engine",
            tasks: [
              "Motor key-value en memoria con B-tree",
              "Write-Ahead Log (WAL) para durabilidad",
              "Recuperación automática tras crash",
              "Benchmarks de rendimiento con pprof",
            ],
          },
          {
            week: "Semana 4–6",
            title: "Replicación Raft",
            tasks: [
              "Leader election con timeouts aleatorios",
              "Log replication entre nodos",
              "Snapshots y compactación de log",
              "Tests de partición de red con fault injection",
            ],
          },
          {
            week: "Semana 7–9",
            title: "API y cliente",
            tasks: [
              "gRPC API con Protobuf",
              "Cliente Go con retry y failover automático",
              "Transacciones básicas con MVCC",
              "Panel web de monitoreo del cluster",
            ],
          },
          {
            week: "Semana 10–12",
            title: "Distribución",
            tasks: [
              "Helm chart para Kubernetes",
              "Chaos testing automatizado",
              "Write-up técnico del diseño (con diagramas)",
              "Comparativa de rendimiento vs etcd/Redis",
            ],
          },
        ],
      },
    ],
  },
  fullstack: {
    role: "Fullstack Developer",
    projects: [
      {
        title: "SaaS boilerplate con auth y billing",
        difficulty: "fácil",
        duration: "3–4 semanas",
        description:
          "Template de SaaS completo con autenticación, gestión de suscripciones con Stripe y arquitectura multi-tenant.",
        techs: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Auth.js"],
        why: "Tener un boilerplate propio demuestra que puedes diseñar sistemas end-to-end y que entiendes los requisitos de negocio de una aplicación real. Es también un activo que puedes reutilizar.",
        roadmap: [
          {
            week: "Semana 1",
            title: "Autenticación",
            tasks: [
              "Auth.js con email magic link y OAuth (Google, GitHub)",
              "Middleware de protección de rutas",
              "Perfiles de usuario con avatar",
              "Sesiones seguras con httpOnly cookies",
            ],
          },
          {
            week: "Semana 2",
            title: "Multi-tenancy",
            tasks: [
              "Modelo de organizaciones y roles (owner, admin, member)",
              "Invitaciones por email con token de aceptación",
              "Row-level security en PostgreSQL",
              "Subdominios por tenant",
            ],
          },
          {
            week: "Semana 3",
            title: "Billing con Stripe",
            tasks: [
              "Checkout y Customer Portal",
              "Webhooks para gestión de eventos de pago",
              "Feature flags por plan (free, pro, enterprise)",
              "Dashboard de uso y límites",
            ],
          },
          {
            week: "Semana 4",
            title: "Deploy y open source",
            tasks: [
              "Deploy one-click en Railway",
              "CI/CD con GitHub Actions",
              "Documentación de uso del template",
              "Publicar como template en GitHub",
            ],
          },
        ],
      },
      {
        title: "Plataforma de feedback con analytics",
        difficulty: "normal",
        duration: "6–8 semanas",
        description:
          "Widget JavaScript embebible para capturar feedback, con panel de analytics, análisis de sentimiento y exportación de insights.",
        techs: ["Next.js", "TypeScript", "PostgreSQL", "Recharts", "JS SDK"],
        why: "Construir algo embebible demuestra que entiendes el aislamiento de CSS/JS en contexto de terceros. El layer de analytics añade complejidad de producto real.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Core y widget",
            tasks: [
              "API REST para recibir respuestas de feedback",
              "Widget JavaScript embebible (<2kb gzip)",
              "Tipos de feedback: rating, NPS, texto libre",
              "Iframe isolation para estilos",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Dashboard de analytics",
            tasks: [
              "Vista de respuestas con filtros avanzados",
              "Análisis de sentimiento con API externa",
              "Gráficas de tendencias con Recharts",
              "Etiquetado y categorización manual",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Integraciones",
            tasks: [
              "Webhooks hacia Slack y Notion",
              "Exportar a CSV y JSON",
              "Integración con Zapier vía webhooks",
              "SDK TypeScript con tipos completos",
            ],
          },
          {
            week: "Semana 7–8",
            title: "Go-to-market",
            tasks: [
              "Landing page del producto",
              "Documentación interactiva con ejemplos",
              "Plan gratuito (100 respuestas/mes) y de pago",
              "Lanzamiento en Product Hunt",
            ],
          },
        ],
      },
      {
        title: "Motor de workflows visual",
        difficulty: "difícil",
        duration: "10–12 semanas",
        description:
          "Plataforma tipo n8n/Zapier propia: editor visual de nodos, motor de ejecución con cola de trabajos y sistema de triggers.",
        techs: ["Next.js", "TypeScript", "React Flow", "BullMQ", "Redis", "PostgreSQL"],
        why: "Este proyecto cubre sistemas distribuidos, UX compleja y arquitectura de producto real. Es el tipo de trabajo que hacen los fullstack seniors en las startups más ambiciosas.",
        roadmap: [
          {
            week: "Semana 1–3",
            title: "Editor visual",
            tasks: [
              "Canvas con React Flow y nodos custom",
              "Conexiones con validación de tipos de datos",
              "Panel de propiedades por nodo",
              "Guardar y cargar workflows desde la base de datos",
            ],
          },
          {
            week: "Semana 4–6",
            title: "Motor de ejecución",
            tasks: [
              "Runner de nodos con BullMQ",
              "Contexto compartido entre nodos en la cadena",
              "Manejo de errores y reintentos configurables",
              "Logs de ejecución en tiempo real (WebSocket)",
            ],
          },
          {
            week: "Semana 7–9",
            title: "Nodos y triggers",
            tasks: [
              "Nodos: HTTP, transform, condition, loop, delay",
              "Triggers: webhook, cron, evento de email",
              "Sandbox de código JavaScript para nodos custom",
              "Tests de workflows con mocks de servicios externos",
            ],
          },
          {
            week: "Semana 10–12",
            title: "Producto completo",
            tasks: [
              "Multi-workspace con permisos de equipo",
              "Versionado de workflows con diff visual",
              "CLI para exportar/importar workflows",
              "Open source en GitHub con documentación",
            ],
          },
        ],
      },
    ],
  },
  data: {
    role: "Data / ML Engineer",
    projects: [
      {
        title: "Pipeline de datos con dashboard",
        difficulty: "fácil",
        duration: "2–3 semanas",
        description:
          "ETL pipeline que procesa datos públicos (climáticos, tráfico o financieros) y los visualiza en un dashboard interactivo con Streamlit.",
        techs: ["Python", "Pandas", "DuckDB", "Streamlit", "Plotly", "GitHub Actions"],
        why: "Demuestra que puedes tomar datos crudos, procesarlos y convertirlos en insights accionables. Es el ciclo completo que busca cualquier empresa de datos.",
        roadmap: [
          {
            week: "Semana 1",
            title: "Extracción y procesado",
            tasks: [
              "Seleccionar un dataset público interesante y relevante",
              "Scripts de extracción con httpx/requests",
              "Limpieza y transformación con Pandas",
              "Storage incremental en DuckDB",
            ],
          },
          {
            week: "Semana 2",
            title: "Dashboard",
            tasks: [
              "Dashboard con Streamlit",
              "Gráficas interactivas con Plotly",
              "Filtros, sliders y selectors de fecha",
              "KPIs destacados con métricas clave",
            ],
          },
          {
            week: "Semana 3",
            title: "Automatización",
            tasks: [
              "GitHub Actions para actualización diaria",
              "Tests de calidad de datos (validaciones)",
              "Deploy en Streamlit Cloud",
              "README con capturas y metodología",
            ],
          },
        ],
      },
      {
        title: "Motor de recomendaciones desde cero",
        difficulty: "normal",
        duration: "6–8 semanas",
        description:
          "Sistema de recomendaciones con collaborative filtering, content-based y un API REST para consumirlo, implementado solo con NumPy.",
        techs: ["Python", "NumPy", "FastAPI", "PostgreSQL", "Redis", "Docker"],
        why: "Entender recomendaciones sin librerías mágicas demuestra comprensión profunda de álgebra lineal aplicada. Es el tipo de profundidad técnica que diferencia a los ML engineers.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Datos y baseline",
            tasks: [
              "Dataset MovieLens o similar (ratings reales)",
              "Collaborative filtering con matrix factorization (SVD)",
              "Evaluación con RMSE, Precision@K, NDCG",
              "Baseline de popularidad para comparar",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Content-based e híbrido",
            tasks: [
              "Features de contenido con TF-IDF",
              "Modelo híbrido con weighted ensemble",
              "Estrategia de cold start para nuevos usuarios",
              "Framework de A/B testing propio",
            ],
          },
          {
            week: "Semana 5–6",
            title: "API y serving",
            tasks: [
              "API con FastAPI y documentación OpenAPI",
              "Cache de recomendaciones en Redis (TTL)",
              "Logging de interacciones para retroalimentación",
              "Feature store básico para pre-computar embeddings",
            ],
          },
          {
            week: "Semana 7–8",
            title: "MLOps",
            tasks: [
              "Reentrenamiento automático semanal",
              "Monitoreo de data drift con alertas",
              "Versionado de modelos con MLflow",
              "Write-up técnico del sistema completo",
            ],
          },
        ],
      },
      {
        title: "Feature Store desde cero",
        difficulty: "difícil",
        duration: "10–12 semanas",
        description:
          "Feature store completo con ingesta de datos en streaming, transformaciones versionadas, y serving de baja latencia para modelos en producción.",
        techs: ["Python", "Apache Kafka", "Apache Spark", "PostgreSQL", "Redis", "gRPC"],
        why: "Los feature stores son infraestructura crítica de ML que pocas personas saben construir. Este proyecto posiciona al candidato para roles de ML Platform Engineer con salarios premium.",
        roadmap: [
          {
            week: "Semana 1–3",
            title: "Ingesta",
            tasks: [
              "Producers Kafka para datos batch y streaming",
              "Schema registry con Avro",
              "Consumers con procesado básico",
              "Almacenamiento en offline store (Parquet/DuckDB)",
            ],
          },
          {
            week: "Semana 4–6",
            title: "Transformaciones",
            tasks: [
              "DSL Python para definir features declarativamente",
              "Transformaciones batch con PySpark",
              "Transformaciones en streaming con Faust",
              "Backfill histórico automatizado",
            ],
          },
          {
            week: "Semana 7–9",
            title: "Online store y serving",
            tasks: [
              "Online store con Redis para baja latencia",
              "gRPC API para feature serving (<5ms p99)",
              "Point-in-time correctness en entrenamiento",
              "SDK de Python para equipos de ML",
            ],
          },
          {
            week: "Semana 10–12",
            title: "Operaciones",
            tasks: [
              "Linaje de datos y metadata catalog",
              "Monitoreo de feature drift con alertas automáticas",
              "Dashboard de uso por modelo",
              "Comparativa de diseño vs Feast/Tecton",
            ],
          },
        ],
      },
    ],
  },
  devops: {
    role: "DevOps / Platform Engineer",
    projects: [
      {
        title: "Módulos Terraform para startup",
        difficulty: "fácil",
        duration: "2–3 semanas",
        description:
          "Terraform modules reutilizables para desplegar una app full-stack en AWS con todos los best practices de seguridad y escalabilidad.",
        techs: ["Terraform", "AWS", "GitHub Actions", "Checkov", "tfsec"],
        why: "Los templates de IaC reutilizables son algo que toda empresa necesita. Demuestra disciplina de infraestructura y comprensión de security by design desde el inicio.",
        roadmap: [
          {
            week: "Semana 1",
            title: "Red y compute",
            tasks: [
              "VPC con subnets públicas, privadas e intra",
              "ECS Fargate para la aplicación",
              "RDS PostgreSQL con Multi-AZ",
              "ElastiCache Redis para cache/sesiones",
            ],
          },
          {
            week: "Semana 2",
            title: "Seguridad",
            tasks: [
              "IAM roles con least privilege por servicio",
              "Secrets Manager para credenciales rotadas",
              "WAF y restricciones de red",
              "Checkov + tfsec para security scanning automático",
            ],
          },
          {
            week: "Semana 3",
            title: "CI/CD y documentación",
            tasks: [
              "Pipeline de GitHub Actions con plan en PRs",
              "Apply automático en merge a main",
              "Documentación con terraform-docs",
              "Examples completos de uso del módulo",
            ],
          },
        ],
      },
      {
        title: "Portal de Developer Experience interno",
        difficulty: "normal",
        duration: "6–8 semanas",
        description:
          "IDP (Internal Developer Portal) tipo Backstage simplificado: catálogo de servicios, métricas de salud y self-service de infra.",
        techs: ["Next.js", "TypeScript", "Kubernetes API", "Prometheus", "Grafana"],
        why: "Platform engineering es uno de los roles más demandados. Un IDP propio demuestra que entiendes tanto los problemas de infra como los de developer experience.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Catálogo de servicios",
            tasks: [
              "Conexión con Kubernetes API (in-cluster o kubeconfig)",
              "Lista de deployments con estado en tiempo real",
              "Búsqueda y filtros por namespace y labels",
              "Vista de detalle de servicio (pods, events, config)",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Observabilidad integrada",
            tasks: [
              "Métricas de Prometheus embebidas por servicio",
              "Acceso directo a logs desde el portal",
              "Alertas activas y su contexto",
              "Health score calculado por servicio",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Self-service",
            tasks: [
              "Crear namespaces con un clic y labels automáticos",
              "Rollback de deployments con un botón",
              "Gestión básica de secretos",
              "Actions de mantenimiento (restart, scale)",
            ],
          },
          {
            week: "Semana 7–8",
            title: "Adopción de equipo",
            tasks: [
              "Auth con SSO (OIDC/SAML)",
              "Notificaciones de eventos por Slack",
              "CLI companion para acciones desde terminal",
              "Documentación de onboarding para nuevos devs",
            ],
          },
        ],
      },
      {
        title: "Kubernetes Operator personalizado",
        difficulty: "difícil",
        duration: "8–10 semanas",
        description:
          "Operator de Kubernetes para gestionar aplicaciones stateful complejas, con CRDs, reconciliation loops y admission webhooks.",
        techs: ["Go", "kubebuilder", "controller-runtime", "Helm", "OpenTelemetry"],
        why: "Los Kubernetes operators son la herramienta más avanzada del ecosistema cloud-native. Este proyecto abre puertas a roles de Platform Engineer, SRE y Cloud Architect con salarios top.",
        roadmap: [
          {
            week: "Semana 1–2",
            title: "Fundamentos del operator",
            tasks: [
              "Setup con kubebuilder y scaffolding",
              "CRD design con validación OpenAPI",
              "Controller con reconciliation loop básico",
              "Tests con envtest (entorno Kubernetes real)",
            ],
          },
          {
            week: "Semana 3–4",
            title: "Lógica de negocio",
            tasks: [
              "Ciclo de vida: pending → running → upgrading → failed",
              "Gestión de StatefulSets y Services derivados",
              "Backup automático a S3 según CRD schedule",
              "Finalizers para cleanup controlado",
            ],
          },
          {
            week: "Semana 5–6",
            title: "Webhooks y seguridad",
            tasks: [
              "Validating admission webhook con mensajes de error claros",
              "Mutating webhook con valores por defecto",
              "RBAC granular para el operator",
              "Análisis de seguridad con kubesec",
            ],
          },
          {
            week: "Semana 7–10",
            title: "Distribución",
            tasks: [
              "Helm chart del operator con OLM support",
              "Suite de e2e tests en kind (Kubernetes in Docker)",
              "Métricas con OpenTelemetry y dashboard Grafana",
              "Documentación completa con runbooks",
            ],
          },
        ],
      },
    ],
  },
};

function detectProfile(url: string): keyof typeof profiles {
  const lower = url.toLowerCase();
  if (lower.includes("data") || lower.includes("ml") || lower.includes("machine") || lower.includes("analytics") || lower.includes("science")) return "data";
  if (lower.includes("devops") || lower.includes("platform") || lower.includes("sre") || lower.includes("infra") || lower.includes("cloud")) return "devops";
  if (lower.includes("backend") || lower.includes("python") || lower.includes("django") || lower.includes("rails") || lower.includes("api")) return "backend";
  if (lower.includes("frontend") || lower.includes("react") || lower.includes("ui") || lower.includes("css") || lower.includes("design")) return "frontend";
  const keys = Object.keys(profiles) as (keyof typeof profiles)[];
  return keys[url.length % keys.length] ?? "frontend";
}

const difficultyConfig: Record<Difficulty, { label: string; color: string; bg: string; desc: string }> = {
  "fácil": {
    label: "FÁCIL",
    color: "#b5f23c",
    bg: "rgba(181,242,60,0.08)",
    desc: "2–4 semanas · Ideal para empezar",
  },
  "normal": {
    label: "NORMAL",
    color: "#f2a93c",
    bg: "rgba(242,169,60,0.08)",
    desc: "4–8 semanas · Nivel intermedio",
  },
  "difícil": {
    label: "DIFÍCIL",
    color: "#f25c5c",
    bg: "rgba(242,92,92,0.08)",
    desc: "8–12 semanas · Para destacar radicalmente",
  },
};

function RoadmapView({ project }: { project: Project }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="mt-6 space-y-6">
      {project.roadmap.map((phase, pi) => (
        <div key={pi} className="relative pl-6">
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <div
            className="absolute left-[-4px] top-[6px] w-2 h-2 rounded-full"
            style={{ background: difficultyConfig[project.difficulty].color }}
          />
          <div className="mb-3">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: difficultyConfig[project.difficulty].color }}
            >
              {phase.week}
            </span>
            <h4 className="text-sm font-medium text-foreground mt-0.5" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem", letterSpacing: "0.02em" }}>
              {phase.title}
            </h4>
          </div>
          <ul className="space-y-2">
            {phase.tasks.map((task, ti) => {
              const key = `${pi}-${ti}`;
              const done = checked.has(key);
              return (
                <li
                  key={ti}
                  onClick={() => toggle(key)}
                  className="flex items-start gap-2.5 cursor-pointer group"
                >
                  <span
                    className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-150"
                    style={{
                      borderColor: done
                        ? difficultyConfig[project.difficulty].color
                        : "rgba(255,255,255,0.2)",
                      background: done
                        ? difficultyConfig[project.difficulty].color
                        : "transparent",
                    }}
                  >
                    {done && <Check size={10} color="#080808" strokeWidth={3} />}
                  </span>
                  <span
                    className="text-sm leading-relaxed transition-colors"
                    style={{
                      color: done ? "#444" : "#aaa",
                      textDecoration: done ? "line-through" : "none",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {task}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isExpanded,
  onToggle,
}: {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cfg = difficultyConfig[project.difficulty];

  return (
    <div
      className="border transition-all duration-200"
      style={{
        borderColor: isExpanded ? cfg.color : "rgba(255,255,255,0.08)",
        background: isExpanded ? cfg.bg : "#111",
        borderRadius: "2px",
      }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className="font-mono text-xs tracking-widest px-2 py-0.5"
              style={{
                color: cfg.color,
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}40`,
                borderRadius: "2px",
              }}
            >
              {cfg.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground tracking-wider">
              {project.duration}
            </span>
          </div>
          <h3
            className="text-lg font-bold leading-tight text-foreground mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.25rem", letterSpacing: "0.01em" }}
          >
            {String(index + 1).padStart(2, "0")} — {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {project.description}
          </p>
          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.techs.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-1.5 py-0.5"
                style={{
                  color: "#666",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1 text-muted-foreground transition-colors group-hover:text-foreground">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Why */}
          <div
            className="mt-4 p-3 rounded-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="font-mono text-xs tracking-widest uppercase block mb-1"
              style={{ color: cfg.color }}
            >
              Por qué este proyecto
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "#999", fontFamily: "'DM Sans', sans-serif" }}>
              {project.why}
            </p>
          </div>

          {/* Roadmap header */}
          <div className="mt-6 flex items-center justify-between">
            <span
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: cfg.color }}
            >
              Roadmap
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Haz clic en las tareas para marcarlas
            </span>
          </div>

          <RoadmapView project={project} />
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function Advisor() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<{ role: string; projects: Project[] } | null>(null);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [urlError, setUrlError] = useState<string | null>(null);

  const isValidJobUrl = (value: string): boolean => {
    try {
      const { hostname } = new URL(value);
      const host = hostname.replace("www.", "");
      return host === "linkedin.com" || host === "indeed.com";
    } catch {
      return false;
    }
  };

  const handleAnalyze = () => {
    if (!url.trim()) return;
    if (!isValidJobUrl(url)) {
      setUrlError("Solo se aceptan URLs de LinkedIn o Indeed.");
      return;
    }
    setUrlError(null);
    setStatus("loading");
    setExpanded(0);
    setTimeout(() => {
      const key = detectProfile(url);
      setResult(profiles[key] ?? null);
      setStatus("done");
    }, 2200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const loadingSteps = [
    "Analizando oferta de trabajo…",
    "Detectando stack tecnológico…",
    "Generando proyectos personalizados…",
  ];
  const [loadingStep, setLoadingStep] = useState(0);

  if (status === "loading" && loadingStep < 2) {
    setTimeout(() => setLoadingStep((s) => Math.min(s + 1, 2)), 700);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-6xl font-bold leading-none mb-4 uppercase tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.01em" }}
          >
            Pega la oferta.<br />
            <span style={{ color: "#b5f23c" }}>Obtén tus proyectos.</span>
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: "#777", fontFamily: "'DM Sans', sans-serif" }}
          >
            Analiza una oferta de trabajo y recibe 3 side projects adaptados al stack requerido —
            con roadmap detallado para cada uno.
          </p>
        </div>

        {/* Form */}
        <div className="mb-10">
          <label
            className="block font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "#555" }}
          >
            URL de la oferta
          </label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
                onKeyDown={handleKeyDown}
                placeholder="https://linkedin.com/jobs/view/…"
                className="w-full px-4 py-3 text-sm outline-none transition-all duration-150"
                style={{
                  background: "#111",
                  border: `1px solid ${urlError ? "rgba(242,92,92,0.6)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "2px",
                  color: "#eee",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  boxShadow: urlError ? "0 0 0 2px rgba(242,92,92,0.08)" : "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#b5f23c";
                  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(181,242,60,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === "loading" || !url.trim()}
              className="flex items-center gap-2 px-5 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{
                background: "#b5f23c",
                color: "#080808",
                borderRadius: "2px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.background = "#c8ff55";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#b5f23c";
              }}
            >
              {status === "loading" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
              Analizar
            </button>
          </div>
          {urlError ? (
            <p className="mt-2 font-mono text-xs flex items-center gap-1.5" style={{ color: "#f25c5c" }}>
              <span>✕</span> {urlError}{" "}
              <span style={{ color: "#555" }}>Soportamos linkedin.com e indeed.com.</span>
            </p>
          ) : (
            <p className="mt-2 font-mono text-xs" style={{ color: "#444" }}>
              Solo se aceptan URLs de LinkedIn e Indeed
            </p>
          )}
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="py-16 text-center space-y-3">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-6"
              style={{ borderColor: "rgba(181,242,60,0.2)", borderTopColor: "#b5f23c" }}
            />
            {loadingSteps.map((step, i) => (
              <div
                key={i}
                className="font-mono text-xs tracking-wider transition-all duration-300"
                style={{
                  color: i <= loadingStep ? "#b5f23c" : "#333",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {i <= loadingStep ? "✓" : "·"} {step}
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {status === "done" && result && (
          <div>
            {/* Result header */}
            <div
              className="flex items-center gap-3 mb-2 pb-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex-1">
                <p className="font-mono text-xs tracking-widest uppercase" style={{ color: "#555" }}>
                  Perfil detectado
                </p>
                <h2
                  className="text-2xl font-bold mt-0.5"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.01em" }}
                >
                  {result.role}
                </h2>
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  setUrl("");
                }}
                className="font-mono text-xs tracking-wider px-3 py-1.5 transition-colors"
                style={{
                  color: "#555",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#eee";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#555";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                ↩ Nueva búsqueda
              </button>
            </div>

            {/* Difficulty legend */}
            <div className="flex flex-wrap gap-4 mb-6 py-4">
              {(Object.entries(difficultyConfig) as [Difficulty, typeof difficultyConfig[Difficulty]][]).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs tracking-wider px-2 py-0.5"
                    style={{
                      color: cfg.color,
                      background: `${cfg.color}18`,
                      border: `1px solid ${cfg.color}40`,
                      borderRadius: "2px",
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs" style={{ color: "#555", fontFamily: "'DM Sans', sans-serif" }}>
                    {cfg.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Project cards */}
            <div className="space-y-3">
              {result.projects.map((project, i) => (
                <ProjectCard
                  key={i}
                  project={project}
                  index={i}
                  isExpanded={expanded === i}
                  onToggle={() => setExpanded(expanded === i ? null : i)}
                />
              ))}
            </div>

            {/* Footer note */}
            <div
              className="mt-10 pt-6 border-t flex items-start gap-3"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <ExternalLink size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#444" }} />
              <p className="text-xs leading-relaxed" style={{ color: "#555", fontFamily: "'DM Sans', sans-serif" }}>
                Los proyectos están adaptados al stack y nivel de la oferta analizada. Haz clic en
                cada card para ver el roadmap detallado e ir marcando las tareas completadas.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
