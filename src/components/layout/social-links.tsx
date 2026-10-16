import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Social brand icons for the footer. Newer lucide-react versions dropped
 * brand icons, so these are compact inline SVGs with `currentColor` to
 * follow the theme.
 */

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.5 6.5h.01" />
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.26 5.26 0 0 0-1.5-3.5A4.8 4.8 0 0 0 18.4 2S17.4 1.65 15 3.48a13.38 13.38 0 0 0-6 0C6.6 1.65 5.6 2 5.6 2a4.8 4.8 0 0 0-.1 3.5A5.26 5.26 0 0 0 4 9c0 3.5 3 5.5 6 5.5A4.8 4.8 0 0 0 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "https://instagram.com/amirahadi_web", label: "Instagram", Icon: InstagramIcon },
  { href: "https://linkedin.com/in/amirmohammad-ahadi", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://github.com/AmirAhadi-web/", label: "GitHub", Icon: GithubIcon },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Social media" className={cn("flex items-center gap-1.5", className)}>
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Icon className="size-[18px]" />
        </a>
      ))}
    </nav>
  );
}
