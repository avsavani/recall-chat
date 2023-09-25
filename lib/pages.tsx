import fs from 'fs';
import path from 'path';

const pagesData = [
    {
        slugAsParams: "privacy",
        title: "Privacy Policy",
        description: "Typefrost privacy policy",
    },
    {
        slugAsParams: "terms",
        title: "Terms & Conditions",
        description: "Typefrost Terms and Conditions",
    },
];

export function getPageFromParams(slug) {
    const page = pagesData.find((page) => page.slugAsParams === slug);

    if (!page) {
        return null;
    }

    const mdxFilePath = path.join(process.cwd(), 'pages/content/', `${slug}.mdx`);
    const mdxContent = fs.readFileSync(mdxFilePath, 'utf8');

    return { ...page, mdxContent };
}
