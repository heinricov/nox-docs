const FORMAT_OPTIONS = {
  singleQuote: false,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: "lf",
  trailingComma: "es5",
} as const

export function getPrettierParser(language: string): string | null {
  switch (language) {
    case "typescript":
    case "tsx":
      return "typescript"
    case "javascript":
    case "jsx":
      return "babel"
    case "json":
      return "json"
    case "markdown":
      return "markdown"
    case "mdx":
      return "mdx"
    case "html":
    case "xml":
    case "svg":
      return "html"
    case "vue":
      return "vue"
    case "css":
      return "css"
    case "scss":
      return "scss"
    case "less":
      return "less"
    case "yaml":
    case "yml":
      return "yaml"
    default:
      return null
  }
}

export async function formatCode(
  code: string,
  language: string
): Promise<string> {
  const parser = getPrettierParser(language)
  if (!parser) return code
  try {
    const prettier = (await import("prettier/standalone")).default
    const babel = (await import("prettier/plugins/babel")).default
    const estree = (await import("prettier/plugins/estree")).default
    const html = (await import("prettier/plugins/html")).default
    const markdown = (await import("prettier/plugins/markdown")).default
    const postcss = (await import("prettier/plugins/postcss")).default
    const typescript = (await import("prettier/plugins/typescript")).default
    const yaml = (await import("prettier/plugins/yaml")).default
    return await prettier.format(code, {
      ...FORMAT_OPTIONS,
      parser,
      plugins: [babel, estree, html, markdown, postcss, typescript, yaml],
    })
  } catch {
    return code
  }
}