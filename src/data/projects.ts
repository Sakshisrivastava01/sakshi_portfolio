export interface Project {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  status: string;
  metrics?: string[];
  tags?: string[];
}

export const projects: Project[] = [
  {
    id: "1",
    name: "AI Portfolio",
    description: "A highly interactive, dynamic, and animated portfolio utilizing Framer Motion, Next.js App Router, and Tailwind CSS to showcase engineering projects.",
    tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github_url: "https://github.com/Sakshisrivastava01/sakshi_portfolio",
    live_url: "https://sakshisrivastava.dev",
    featured: true,
    status: "Completed",
    metrics: ["100/100 Lighthouse Score", "Zero Lag Animations", "Responsive"],
    tags: ["Frontend", "UX", "Web3 Design"]
  },
  // Add more projects here as needed
];
