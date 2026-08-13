"use client"

import { ChevronDownIcon } from "lucide-react"

import { SiMdx, SiClaude, SiV0 } from "react-icons/si"
import { FaRegCopy } from "react-icons/fa"

import { Button } from "mdxui/ui/button"
import { ButtonGroup } from "mdxui/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "mdxui/ui/dropdown-menu"

export function MdxCopyPage() {
  return (
    <ButtonGroup className="hidden md:flex">
      <Button variant="outline">
        Copy <FaRegCopy />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="pl-2!">
              <ChevronDownIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <SiMdx />
              Copy Mdx
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SiClaude />
              Open Claude
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SiV0 />
              Open V0
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
