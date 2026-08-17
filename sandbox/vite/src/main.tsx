import { NoxLayout } from "noxkit"
import { NoxRender } from "noxkit"
import type { NoxSidebarMenu } from "noxkit"

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
