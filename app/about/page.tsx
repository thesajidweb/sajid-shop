import Image from "next/image";
import {
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Phone,
  LucideIcon,
  Layout,
  Server,
  Code2,
  Database,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Sajid Shop (Demo E-commerce Platform)",
  description:
    "Learn about Sajid Shop, a portfolio e-commerce application built with Next.js. This demo project showcases product management, authentication, and scalable architecture for learning purposes.",
};
/* ------------------ TYPES ------------------ */

interface SkillItem {
  name: string;
  level: number;
  icon: string;
}

interface SkillSection {
  title: string;
  icon: LucideIcon;
  items: SkillItem[];
}

interface SkillCardProps {
  section: SkillSection;
}

/* ------------------ DATA ------------------ */

export const skills: SkillSection[] = [
  {
    title: "Frontend",
    icon: Layout,
    items: [
      { name: "HTML5 / CSS3", level: 90, icon: "🌐" },
      { name: "Tailwind CSS", level: 85, icon: "🎨" },
      { name: "JavaScript (ES6+)", level: 80, icon: "⚡" },
      { name: "TypeScript", level: 75, icon: "📘" },
      { name: "React.js", level: 80, icon: "⚛️" },
      { name: "Next.js (App Router)", level: 80, icon: "▲" },
      { name: "ShadCN UI", level: 75, icon: "🧩" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      { name: "Next.js API Routes", level: 75, icon: "🔗" },
      { name: "REST APIs", level: 70, icon: "🌍" },
      { name: "Authentication (Better Auth)", level: 70, icon: "🔐" },
      { name: "MongoDB", level: 70, icon: "🍃" },
      { name: "Mongoose", level: 70, icon: "📊" },
    ],
  },

  {
    title: "Tools & Workflow",
    icon: Code2,
    items: [
      { name: "Git / GitHub", level: 60, icon: "📦" },
      { name: "VS Code", level: 90, icon: "💻" },
      { name: "Thunder Client", level: 80, icon: "⚡" },

      { name: "ChatGPT (Code Assistant)", level: 85, icon: "🤖" },
      { name: "DeepSeek (Code Assistant)", level: 80, icon: "🧠" },
    ],
  },
  {
    title: "State & Validation",
    icon: ShieldCheck,
    items: [
      { name: "Redux Toolkit", level: 75, icon: "🧠" },
      { name: "React Hook Form", level: 80, icon: "📝" },
      { name: "Zod (Schema Validation)", level: 75, icon: "✅" },
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      { name: "MongoDB Atlas", level: 70, icon: "☁️" },
      { name: "Data Modeling", level: 65, icon: "🧱" },
    ],
  },
];

const tags: string[] = [
  "Self-Taught",
  "Problem Solver",
  "Fast Learner",
  "Detail Oriented",
];

/* ------------------ UI BLOCKS ------------------ */

function SkillCard({ section }: SkillCardProps) {
  const Icon = section.icon;

  return (
    <div className="p-2 bg-card rounded-xl shadow-sm border">
      <h3 className=" font-semibold mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {section.title}
      </h3>

      {section.items.map((skill: SkillItem) => (
        <div key={skill.name} className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <div>
              <span>{skill.icon}</span>
              <span className="p2-text pl-1">{skill.name}</span>
            </div>
            <span className="p-text">{skill.level}%</span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO / ABOUT */}
      <section className="pb-4">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row-reverse gap-12 items-center">
          {/* TEXT */}
          <div>
            <div className="w-full">
              <div className="flex md:items-center md:justify-between gap-4 mb-1">
                {/* Title Section */}
                <div>
                  <h2 className="h-text font-bold tracking-tight">
                    About Me{" "}
                    <Link
                      href="/about/projectOverview"
                      className="p-text text-primary hover:underline px-4 py-1.5 rounded-full inline-block mt-2"
                    >
                      Project Overview →
                    </Link>
                  </h2>
                  {/* Button Section - moved outside h2 */}

                  <p className="text-muted-foreground p-text sm:text-base mt-1">
                    Learn more about me and the project I am building
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-border" />
            </div>
            <h3 className="h2-text mt-2 mb-1 ">
              Self-Taught Next.js Developer
            </h3>
            <p className="text-muted-foreground mb-1 p-text leading-relaxed">
              I am a self-taught developer from Pakistan focused on building
              modern, fast, and scalable web applications using Next.js and
              React.
            </p>
            <p className="text-muted-foreground mb-4 p-text">
              I specialize in building full-stack e-commerce platforms,
              dashboards, and responsive UI systems with clean architecture.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-chart-2 rounded-full  p-text"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* CONTACT */}
            <div className="space-y-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-2 p-text">
                <Mail className="w-4 h-4" /> thesajid.web@gmail.com
              </div>
              <div className="flex items-center gap-2 p-text">
                <Phone className="w-4 h-4" /> +92 342 7108728
              </div>
            </div>
            {/* SOCIAL */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/thesajidweb/sajid-shop"
                className="flex items-center gap-2 text-primary p-text"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>

              <a
                href="https://linkedin.com/in/muhammad-sajid-shah-2003203a7"
                className="flex items-center gap-2 text-primary p-text"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
          {/* IMAGE */}
          <div className="relative flex justify-center">
            <Image
              src="https://ik.imagekit.io/xo654eryn/Personal%20file/Portfolio.jpg"
              alt="Muhammad Sajid Shah"
              width={500}
              height={600}
              className="rounded-2xl shadow-xl object-cover"
              priority
            />
            <div className="absolute -bottom-4 -right-4 bg-primary p-3 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="h-text text-3xl font-bold text-center mb-10">
            Technical Skills
          </h2>

          <div className="grid md:grid-cols-3 md:gap-4 gap-2">
            {skills.map((section: SkillSection) => (
              <SkillCard key={section.title} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-2 bg-muted/30 text-center">
        <h2 className="h-text  font-bold mb-2">Let&apos;s Work Together</h2>

        <p className="text-muted-foreground mb-4 p-text">
          I am open to junior developer roles and internships.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="mailto:thesajid.web@gmail.com"
            className="px-6 py-3 bg-primary rounded-lg p-text"
          >
            <Mail className="inline w-4 h-4 mr-2" />
            Email Me
          </a>

          <a
            href="https://wa.me/923427108728"
            className="px-6 py-3 bg-green-600 rounded-lg p-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="inline w-4 h-4 mr-2" />
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
