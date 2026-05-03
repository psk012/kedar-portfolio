import SectionWrapper from "@/app/components/SectionWrapper";

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="max-w-3xl">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-600 mb-6">
          About
        </p>

        <h2 className="hover-lift font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-100 mb-6 md:mb-10">
          I build things
          <br />
          <span className="text-zinc-500">people can actually rely on.</span>
        </h2>

        <div className="space-y-6 text-sm md:text-base text-zinc-500 leading-[1.8] max-w-[280px] sm:max-w-lg md:max-w-2xl">
          <p>
            I don&apos;t think much about launching things. I think about what
            happens after; when people actually use it, when things don&apos;t
            go as planned, when it needs to hold quietly.
          </p>
          <p>
            That&apos;s where most things fall apart. That&apos;s where I like
            to work.
          </p>
          <p>
            I care about things that feel simple but aren&apos;t.
          </p>
          <p>
            I don&apos;t build to impress. <br></br> <b>I build because the problem deserves
              to be handled well. </b>
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

