import Container from "@/app/components/Container";
import Navbar from "@/app/components/Navbar";
import CinematicBackground from "@/app/components/CinematicBackground";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Projects from "@/app/sections/Projects";
import Skills from "@/app/sections/Skills";
import Contact from "@/app/sections/Contact";
import localFont from "next/font/local";

const saman = localFont({
  src: "./fonts/saman.ttf",
  display: "swap",
});

function Footer() {
  return (
    <footer className="border-t border-white/[0.08]">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <span className="font-display text-xs font-medium tracking-widest uppercase text-zinc-700">
            © P. S. Kedar
          </span>

          <p className={`${saman.className} text-zinc-300 tracking-widest text-lg md:text-2xl md:absolute md:left-1/2 md:-translate-x-1/2`}>
            Raso Vai Saha
          </p>

          <div className="flex gap-6 text-xs font-medium tracking-widest uppercase">
            {[
              { label: "GitHub", href: "https://github.com/psk012" },
              { label: "LinkedIn", href: "https://linkedin.com/in/subrahmanyakedarpantula816" },
              { label: "Email", href: "mailto:pskedhar@gmail.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      {/*
        CinematicBackground renders:
          1. A fixed video at z=-1 (global — persists across ALL sections)
          2. A fixed gradient overlay at z=-1 (darkens as user scrolls)

        This works because:
          html { background: #0a0a0a }  ← opaque canvas at very bottom
          body { background: transparent } ← no paint, lets z=-1 show
          z=-1 fixed video ← visible between html canvas and content
          z=auto content   ← navbar, sections, footer on top
      */}
      <CinematicBackground />

      <Navbar />

      <main>
        {/* Hero: full-viewport, bg-transparent — video shows through */}
        <Hero />

        {/*
          Content sections: no background-color, so the global video bleeds
          through glass cards and open areas. The global overlay (from
          CinematicBackground) darkens progressively for readability.

          lg:pl-16 / xl:pl-0 — offsets content from the left nav rail.
        */}
        <div className="lg:pl-16 xl:pl-0">
          <Container>
            <About />
            <Projects />
            <Skills />
            <Contact />
          </Container>
        </div>
      </main>

      <Footer />
    </>
  );
}
