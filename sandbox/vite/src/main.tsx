import { NoxLayout } from "@nox/layouts"
import { NoxRender } from "@nox/render"
import type { NoxSidebarMenu } from "@nox/layouts"

const menu: NoxSidebarMenu[] = [
  {
    type: "main",
    label: "Documentation",
    items: [{ title: "Introduction", url: "/docs/index" }],
  },
]

void NoxLayout
void NoxRender
void menu

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>nox installed in vite: imports resolved</div>
  </StrictMode>
)
