import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { notFound } from 'next/navigation';
import MarkdownIt from 'markdown-it';
import { getContent } from '@/lib/serverpathutils';

export const revalidate = 0;

interface TermsOfUsePageProps {
    params: {
        locale: string;
    };
}

export default async function TermsOfUsePage({ params }: TermsOfUsePageProps) {
    const legalContent = await getContent('terms-of-use.md', params.locale);

    if (!legalContent) {
        notFound();
    }

    const md = new MarkdownIt({
        breaks: true
    });
    const htmlContent = md.render(legalContent.content);

    return (
        <LegalPageLayout title={legalContent.title}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </LegalPageLayout>
    );
}