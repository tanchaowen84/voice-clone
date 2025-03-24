import CategoryNavigation from '@/components/nsui/blocks-nav'
import { categories } from '@/components/nsui/blocks'

export default function CategoryLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <CategoryNavigation categories={categories} />
            <main>{children}</main>
        </>
    )
}
