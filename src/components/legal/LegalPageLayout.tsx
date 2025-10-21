// components/legal/LegalPageLayout.tsx

import React from 'react';

interface LegalPageLayoutProps {
    title: string;
    children: React.ReactNode; // Сюда будет передаваться контент страницы
}

/**
 * Этот компонент-обертка задает единый стиль для всех юридических страниц.
 * Он отвечает за заголовок, отступы и стилизацию контента.
 */
export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
    return (
        <main className="bg-background text-textPrimary py-12 sm:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <article
                    className="
            prose prose-lg max-w-4xl mx-auto
            prose-headings:text-headings prose-headings:font-semibold
            prose-p:text-textPrimary prose-p:leading-relaxed
            prose-a:text-primary hover:prose-a:text-violet-700
            prose-strong:font-semibold
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:my-2
          "
                >
                    <h1>{title}</h1>
                    {children}
                </article>
            </div>
        </main>
    );
}