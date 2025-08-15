import React from 'react';

const addTargetBlankToLinks = (html: string) => {
    return html.replace(/<a(.*?)>/g, (match: string) => {
        if (!match.includes('target="_blank"')) {
            return match.replace('<a', '<a target="_blank"');
        }
        return match;
    });
};

const EmailViewer = ({
    html
}: {
    html: string
}) => {

    const updatedHtmlContent = addTargetBlankToLinks(html);

    return (
        <iframe
            className='w-full h-full border-0 bg-background text-foreground'
            srcDoc={updatedHtmlContent}
            title="Email Viewer"
        />
    );

};

export { EmailViewer };
