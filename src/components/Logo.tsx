// Placeholder text logo — swap this markup for an <img src="..."> once the
// real logo asset is ready. Keeping it as a single component means every
// screen that renders <Logo /> picks up the change automatically.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-extrabold tracking-tight text-black select-none ${className}`}
    >
      ROBLOX STUDIO
      <span className="font-normal text-neutral-400"> PROJECTS</span>
    </span>
  )
}
