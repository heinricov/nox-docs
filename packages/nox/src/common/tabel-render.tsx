import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nox/components/table"
import { cn } from "@nox/lib/utils"

type TableNodeProps = {
  children?: ReactNode
  className?: string
}

const TYPE_STYLES: Record<string, string> = {
  string: "text-emerald-600 dark:text-emerald-400",
  boolean: "text-amber-600 dark:text-amber-400",
  number: "text-sky-600 dark:text-sky-400",
  bigint: "text-sky-600 dark:text-sky-400",
  object: "text-blue-600 dark:text-blue-400",
  array: "text-blue-600 dark:text-blue-400",
  record: "text-blue-600 dark:text-blue-400",
  map: "text-blue-600 dark:text-blue-400",
  set: "text-blue-600 dark:text-blue-400",
  function: "text-rose-600 dark:text-rose-400",
  promise: "text-orange-600 dark:text-orange-400",
  reactnode: "text-violet-600 dark:text-violet-400",
  reactelement: "text-violet-600 dark:text-violet-400",
  void: "text-zinc-500 dark:text-zinc-400",
  unknown: "text-zinc-500 dark:text-zinc-400",
  any: "text-zinc-500 dark:text-zinc-400",
  undefined: "text-zinc-500 dark:text-zinc-400",
  null: "text-zinc-500 dark:text-zinc-400",
}

const TYPE_REGEX = new RegExp(
  `\\b(${Object.keys(TYPE_STYLES).sort((a, b) => b.length - a.length).join("|")})\\b`,
  "gi"
)

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeToText(node.props.children)
  }
  return ""
}

function colorizeText(text: string): ReactNode {
  const parts = text.split(TYPE_REGEX)
  if (parts.length === 1) return text
  const nodes: ReactNode[] = []
  parts.forEach((part, index) => {
    if (!part) return
    const style = TYPE_STYLES[part.toLowerCase()]
    nodes.push(
      style ? (
        <span key={index} className={style}>
          {part}
        </span>
      ) : (
        part
      )
    )
  })
  return <>{nodes}</>
}

function colorizeNode(node: ReactNode): ReactNode {
  if (node === null || node === undefined || typeof node === "boolean")
    return node
  if (typeof node === "string") return colorizeText(node)
  if (Array.isArray(node)) return node.map(colorizeNode)
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, {
      children: colorizeNode(node.props.children),
    })
  }
  return node
}

function matches(node: ReactNode, tags: string[], refs: unknown[]): boolean {
  if (!isValidElement(node)) return false
  if (typeof node.type === "string" && tags.includes(node.type)) return true
  return refs.some((ref) => node.type === ref)
}

function findFirst(
  children: ReactNode,
  tags: string[],
  refs: unknown[]
): ReactElement | null {
  for (const child of Children.toArray(children)) {
    if (matches(child, tags, refs)) return child as ReactElement
  }
  return null
}

function findTypeColumnIndex(children: ReactNode): number | null {
  const thead = findFirst(children, ["thead"], [TabelHeader])
  if (!thead) return null
  const row = findFirst(
    (thead.props as { children?: ReactNode }).children,
    ["tr"],
    [TabelRow]
  )
  if (!row) return null
  let index = 0
  for (const cell of Children.toArray(
    (row.props as { children?: ReactNode }).children
  )) {
    if (!matches(cell, ["th"], [TabelHead])) continue
    if (/^(tipe|type)$/i.test(nodeToText(cell).trim())) return index
    index++
  }
  return null
}

function colorizeTypeColumn(children: ReactNode): ReactNode {
  const typeIndex = findTypeColumnIndex(children)
  if (typeIndex === null) return children

  return Children.map(children, (node) => {
    if (!matches(node, ["tbody"], [TabelBody])) return node
    return cloneElement(node as ReactElement<{ children?: ReactNode }>, {
      children: Children.map(
        (node as ReactElement<{ children?: ReactNode }>).props.children,
        (row) => {
          if (!matches(row, ["tr"], [TabelRow])) return row
          let cellIndex = 0
          return cloneElement(row as ReactElement<{ children?: ReactNode }>, {
            children: Children.map(
              (row as ReactElement<{ children?: ReactNode }>).props.children,
              (cell) => {
                if (!matches(cell, ["td"], [TabelCell])) return cell
                if (cellIndex === typeIndex) {
                  cellIndex++
                  return cloneElement(
                    cell as ReactElement<{ children?: ReactNode }>,
                    {
                      children: colorizeNode(
                        (cell as ReactElement<{ children?: ReactNode }>).props
                          .children
                      ),
                    }
                  )
                }
                cellIndex++
                return cell
              }
            ),
          })
        }
      ),
    })
  })
}

export function TabelRender({ children, className }: TableNodeProps) {
  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-xl border border-border",
        className
      )}
    >
      <Table>{colorizeTypeColumn(children)}</Table>
    </div>
  )
}

export function TabelHeader(props: TableNodeProps) {
  return <TableHeader {...props} />
}

export function TabelBody(props: TableNodeProps) {
  return <TableBody {...props} />
}

export function TabelRow(props: TableNodeProps) {
  return <TableRow {...props} />
}

export function TabelHead(props: TableNodeProps) {
  return <TableHead className="bg-muted/60 font-semibold" {...props} />
}

export function TabelCell(props: TableNodeProps) {
  return <TableCell {...props} />
}

export const mdxTableComponents = {
  table: TabelRender,
  thead: TabelHeader,
  tbody: TabelBody,
  tr: TabelRow,
  th: TabelHead,
  td: TabelCell,
}

export default TabelRender
