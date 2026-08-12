import './SocialLinks.css'

const LINKS = [
  {
    href: 'https://www.instagram.com/mishratemposervice',
    label: 'Mishra Tempo Service on Instagram',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    href: 'https://soundcloud.com/mishratemposervice',
    label: 'Mishra Tempo Service on SoundCloud',
    icon: (
      <>
        <path d="M3 16.5v-4" />
        <path d="M6.2 17v-6" />
        <path d="M9.4 17V9.2" />
        <path d="M12.6 17V7.4" />
        <path d="M12.6 8.4c1-1.4 2.6-2.2 4.3-2.2 2.9 0 5.1 2.3 5.1 5.2 0 3-2.2 5.6-5.1 5.6h-4.3" />
      </>
    ),
  },
]

export default function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Band links">
      {LINKS.map((link) => (
        <a
          key={link.href}
          className="social-link"
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={link.label}
          title={link.label}
        >
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {link.icon}
          </svg>
        </a>
      ))}
    </nav>
  )
}
