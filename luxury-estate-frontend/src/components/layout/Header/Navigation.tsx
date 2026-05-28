import { NavLink } from 'react-router-dom'
const navItems = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Listings',
        href: '/listings',
    },
    {
        label: 'Agencies',
        href: '/agencies',
    },
    {
        label: 'Associates',
        href: '/associates',
    },
    {
        label: 'News',
        href: '/news',
    },
    {
        label: 'About Us',
        href: '/about',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
]
export function Navigation() {
    return (
        <nav className="flex items-center gap-8">
            {navItems.map((item) => (
                <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                        `
 text-sm font-medium transition-colors
${isActive
                            ? 'text-[#C6A15B]'
                            : 'text-slate-700 hover:text-slate-900'
                        }
 `
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    )
}