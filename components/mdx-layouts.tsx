import { MDXProvider } from '@mdx-js/react'
import { components } from '@/components/mdx-components';

export default function Layout({ children, page }) {
    return (
        <article className="container max-w-3xl py-6 lg:py-12">
            <div className="space-y-4">
                <h1 className="inline-block font-heading text-4xl lg:text-5xl">
                    {page.title}
                </h1>
                {page.description && (
                    <p className="text-xl text-muted-foreground">{page.description}</p>
                )}
            </div>

            <MDXProvider components={components}>
                {children}
            </MDXProvider>
        </article>
    );
}
