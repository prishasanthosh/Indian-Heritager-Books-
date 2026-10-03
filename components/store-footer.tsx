import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

const foundationUrl = 'https://www.indianheritager.org'

const quickLinks = [
  ['About', `${foundationUrl}/about`],
  ['Our Programmes', `${foundationUrl}/projects`],
  ['Volunteer', `${foundationUrl}/volunteer`],
  ['CSR Partnerships', `${foundationUrl}/blog`],
  ['Contact', `${foundationUrl}/contact`],
  ['Reports & Compliance', `${foundationUrl}/donate`],
]

const getInvolvedLinks = [
  ['Donate', `${foundationUrl}/give`],
  ['Project Vidhyadhanam', `${foundationUrl}/programmes/project-vidhyadhanam`],
  ['Donate Books', `${foundationUrl}/project-vidhyadhanam/donate-books`],
  ['Request Books', `${foundationUrl}/project-vidhyadhanam/request-books`],
  ['Partnerships', `${foundationUrl}/contact`],
]

export function StoreFooter() {
  return (
    <footer className="bg-[radial-gradient(ellipse_at_top_left,_#12251f_0%,_#031321_50%)] px-5 py-14 text-[#dce5eb] lg:px-8 lg:pt-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.55fr_0.55fr_1.2fr] lg:gap-12">
        <div className="min-w-0">
          <a href={foundationUrl} className="inline-flex items-center gap-3" aria-label="Indian Heritager Foundation home">
            <img src="/logo.png" alt="" width="56" height="56" className="size-14 rounded-full object-contain" />
            <span>
              <strong className="block text-xl font-extrabold tracking-tight text-white">Indian Heritager</strong>
              <small className="mt-1 block text-[10px] tracking-[0.24em] text-[#aab9c5]">FOUNDATION</small>
            </span>
          </a>
          <p className="mt-6 max-w-sm break-words text-[15px] leading-6 text-[#c2d0da]">
            A charitable organisation working in education, environment, sustainability, community development, skill development and livelihoods.
          </p>
          <address className="mt-6 min-w-0 space-y-3 text-[15px] not-italic text-[#c2d0da]">
            <p className="flex min-w-0 items-center gap-3"><MapPin size={17} className="shrink-0 text-[#a52f17]" aria-hidden="true" /><span className="min-w-0 break-words">Coimbatore, Tamil Nadu, India</span></p>
            <a className="flex min-w-0 items-center gap-3 hover:text-white" href="tel:+917904140033"><Phone size={17} className="shrink-0 text-[#a52f17]" aria-hidden="true" /><span className="min-w-0 break-words">+91 7904140033</span></a>
            <a className="flex min-w-0 items-center gap-3 hover:text-white" href="mailto:info@indianheritager.org"><Mail size={17} className="shrink-0 text-[#a52f17]" aria-hidden="true" /><span className="min-w-0 break-all">info@indianheritager.org</span></a>
          </address>
          <div className="mt-7 flex gap-2.5" aria-label="Social media">
            {['Facebook', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'].map((name) => (
              <span key={name} title={name} className="grid size-11 place-items-center rounded-full bg-white/[0.06] text-xs font-bold text-white">
                {name === 'YouTube' ? '▶' : name === 'LinkedIn' ? 'in' : name === 'Instagram' ? '◎' : name === 'Facebook' ? 'f' : '𝕏'}
                <span className="sr-only">{name}</span>
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links" className="min-w-0">
          <h2 className="text-base font-bold text-white">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-[#c2d0da]">
            {quickLinks.map(([label, href]) => <li key={label}><a className="hover:text-white" href={href}>{label}</a></li>)}
          </ul>
        </nav>

        <nav aria-label="Get involved" className="min-w-0">
          <h2 className="text-base font-bold text-white">Get Involved</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-[#c2d0da]">
            {getInvolvedLinks.map(([label, href]) => <li key={label}><a className="hover:text-white" href={href}>{label}</a></li>)}
          </ul>
        </nav>

        <div className="min-w-0">
          <h2 className="text-base font-bold text-white">Stories in your inbox</h2>
          <p className="mt-4 text-[15px] leading-6 text-[#c2d0da]">A monthly letter from the field — no noise, just impact.</p>
          <form action="mailto:info@indianheritager.org" method="post" encType="text/plain" className="mt-5 flex items-center rounded-full border border-[#283b49] bg-[#10202d] p-1.5">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" name="email" type="email" required placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-[#9aabb9]" />
            <button type="submit" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f4bb20] px-4 py-2.5 text-sm font-semibold text-[#071321] hover:bg-[#ffd044]">
              Subscribe <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="mt-3 text-xs text-[#aab9c5]">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col gap-4 border-t border-[#1e3240] pt-6 text-sm text-[#9aabb9] sm:flex-row sm:items-center sm:justify-between">
        <p className="break-words">© 2026 Indian Heritager Foundation. All rights reserved.</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="hover:text-white" href={`${foundationUrl}/privacy-policy`}>Privacy Policy</a>
          <a className="hover:text-white" href={`${foundationUrl}/terms-and-conditions`}>Terms &amp; Conditions</a>
          <a className="hover:text-white" href={`${foundationUrl}/donate`}>Financial Transparency</a>
        </nav>
      </div>
    </footer>
  )
}
