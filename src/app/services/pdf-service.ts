import { inject, Service } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const exportPdf = gql`
    mutation exportPdf($args: ExportPdfInput!) {
        exportPdf(pdf: $args)
    }
`;

@Service()
export class PdfService {
    private readonly apollo = inject(Apollo);

    exportPdf(html: string){
        return this.apollo.mutate<{exportPdf: string}>({
            mutation: exportPdf,
            variables: {
                args: {
                    html: html,
                },
            }
        })
    }
}
