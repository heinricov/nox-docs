"use client"

import {
  ChevronDown,
  ChevronRight,
  File as FileIcon,
  FileCode2,
  FileJson,
  FileText,
  Folder as FolderIcon,
  FolderOpen,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@nox/lib/utils"
import { projectIcons, type ProjectKey } from "@nox/common/project-icons"
import {
  Children,
  cloneElement,
  isValidElement,
  createContext,
  createElement,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"

type ProjectTreeProps = HTMLAttributes<HTMLDivElement> & {
  name: string
  active?: boolean
  tooltip?: boolean
  project?: string
  children?: ReactNode
}

type FolderProps = HTMLAttributes<HTMLDivElement> & {
  name: string
  open?: boolean
  noted?: string
  children?: ReactNode
}

type FileProps = HTMLAttributes<HTMLDivElement> & {
  name: string
  noted?: string
}

const ProjectTreeContext = createContext({ tooltip: false })

function getFileIcon(name: string): LucideIcon {
  if (name.endsWith(".json")) return FileJson
  if (/\.(tsx?|jsx?|vue|svelte|css|scss|html)$/.test(name)) return FileCode2
  if (/\.(md|mdx|txt)$/.test(name)) return FileText
  return FileIcon
}

function TreeItem({
  children,
  depth = 0,
}: {
  children: ReactNode
  depth?: number
}) {
  return (
    <div
      className="flex flex-col gap-0.5"
      style={{ paddingLeft: depth ? `${depth * 1.125}rem` : undefined }}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        return cloneElement(child as ReactElement<{ depth?: number }>, {
          depth,
        })
      })}
    </div>
  )
}

function FolderItem({
  name,
  open: defaultOpen = false,
  noted,
  children,
  depth = 0,
  className,
}: FolderProps & { depth?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  const { tooltip } = useContext(ProjectTreeContext)

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        aria-expanded={open}
        aria-label={noted ? `${name}: ${noted}` : name}
        title={tooltip ? noted : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group flex min-h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
        style={{ paddingLeft: `${depth * 1.125 + 0.5}rem` }}
      >
        {open ? (
          <ChevronDown className="size-3.5 shrink-0" />
        ) : (
          <ChevronRight className="size-3.5 shrink-0" />
        )}
        {open ? (
          <FolderOpen className="size-4 shrink-0 text-primary" />
        ) : (
          <FolderIcon className="size-4 shrink-0 text-primary" />
        )}
        <span className="truncate">{name}</span>
        {!tooltip && noted && (
          <span className="ml-auto max-w-[55%] truncate text-right text-xs text-muted-foreground/70">
            {noted}
          </span>
        )}
      </button>
      {open && <TreeItem depth={depth + 1}>{children}</TreeItem>}
    </div>
  )
}

function FileItem({
  name,
  noted,
  depth = 0,
  className,
}: FileProps & { depth?: number }) {
  const icon = getFileIcon(name)
  const { tooltip } = useContext(ProjectTreeContext)

  return (
    <div
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label={noted ? `${name}: ${noted}` : name}
      title={tooltip ? noted : undefined}
      style={{ paddingLeft: `${depth * 1.125 + 1.75}rem` }}
    >
      {createElement(icon, { className: "size-4 shrink-0" })}
      <span className="truncate">{name}</span>
      {!tooltip && noted && (
        <span className="ml-auto max-w-[55%] truncate text-right text-xs text-muted-foreground/70">
          {noted}
        </span>
      )}
    </div>
  )
}

export function ProjectTree({
  name,
  active = false,
  tooltip = false,
  project,
  children,
  className,
  ...props
}: ProjectTreeProps) {
  const projectIcon = project
    ? projectIcons[project.toLowerCase() as ProjectKey]
    : undefined

  return (
    <ProjectTreeContext.Provider value={{ tooltip }}>
      <div
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b px-3 py-3",
            active && "bg-accent/60"
          )}
        >
          <FolderOpen className="size-4 text-primary" />
          <span className="truncate text-sm font-semibold">{name}</span>
          {projectIcon ? (
            <span
              className="ml-auto shrink-0 text-foreground/70"
              title={project}
              aria-label={`Proyek ${project}`}
            >
              {createElement(projectIcon, { className: "size-4" })}
            </span>
          ) : active ? (
            <span
              className="ml-auto size-2 rounded-full bg-primary"
              aria-label="Active project"
            />
          ) : null}
        </div>
        <div className="p-2">
          <TreeItem>{children}</TreeItem>
        </div>
      </div>
    </ProjectTreeContext.Provider>
  )
}

export function Folder(props: FolderProps) {
  return <FolderItem {...props} />
}

export function File(props: FileProps) {
  return <FileItem {...props} />
}

export type { FileProps, FolderProps, ProjectTreeProps }
