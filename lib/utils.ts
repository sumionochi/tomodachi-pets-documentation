import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EachRoute, ROUTES } from "./routes-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function helperSearch(
  query: string,
  node: EachRoute,
  prefix: string,
  currenLevel: number,
  maxLevel?: number
) {
  const res: EachRoute[] = [];
  let parentHas = false;

  const nextLink = `${prefix}${node.href}`;
  if (!node.noLink && node.title.toLowerCase().includes(query.toLowerCase())) {
    res.push({ ...node, items: undefined, href: nextLink });
    parentHas = true;
  }
  const goNext = maxLevel ? currenLevel < maxLevel : true;
  if (goNext) {
    node.items?.forEach((item) => {
      const innerRes = helperSearch(
        query,
        item,
        nextLink,
        currenLevel + 1,
        maxLevel
      );
      if (!!innerRes.length && !parentHas && !node.noLink) {
        res.push({ ...node, items: undefined, href: nextLink });
        parentHas = true;
      }
      res.push(...innerRes);
    });
  }
  return res;
}

export function advanceSearch(query: string) {
  return ROUTES.map((node) =>
    helperSearch(query, node, "", 1, query.length == 0 ? 2 : undefined)
  ).flat();
}

// Thursday, May 23, 2024
export function formatDate(dateStr: unknown): string {
  if (typeof dateStr !== "string") return "";
  const [day, month, year] = dateStr.split("-").map(Number);
  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year)
  )
    return "";
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

// May 23, 2024
export function formatDate2(dateStr: unknown): string {
  if (typeof dateStr !== "string") return "";
  const [day, month, year] = dateStr.split("-").map(Number);
  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year)
  )
    return "";
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function stringToDate(date: unknown): Date | null {
  if (typeof date !== "string") return null;
  const [day, month, year] = date.split("-").map(Number);
  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year)
  )
    return null;
  return new Date(year, month - 1, day);
}

// https://devicon.dev/
//  icon format : <i class="devicon-go-plain"></i>
export const fileExtensionIconMap = {
  js: "javascript",
  ts: "typescript",
  jsx: "react",
  tsx: "react",
  java: "java",
  css: "css3",
  md: "markdown",
  mdx: "markdown",
  go: "go",
  astro: "astro",
  prisma: "prisma",
  py: "python",
  kt: "kotlin",
  php: "php",
  gitignore: "git",
  cs: "csharp",
  cpp: "cplusplus",
  c: "c",
  bash: "bash",
  html: "html5",
};

export function hasSupportedExtension(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  if (!ext) return false;
  return !!fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export function getIconName(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  return fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}
