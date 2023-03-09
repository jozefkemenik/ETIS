


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import moment from 'moment';
import store from '@/store';

class PdfService {
    constructor() {
    }

    docDefinition =
        {
            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + '/' + pageCount,
                        alignment: 'center',
                        fontSize: 9,
                        margin: [0, 5, 0, 0]
                    }
                ];
            },
            info: {
                title: '',
                author: '',
                subject: '',
                keywords: '',
            },
            content: [
                { text: 'EASO Training Needs Analysis Tool', style: 'header' },
               // { absolutePosition: { x: 300, y: 45 }, alignment: 'right', color: 'red', text: 'MOCK-UP VERSION' },
                { margin: [0, 0, 0, 15], text: 'My learning path' },
                { margin: [0, 0, 0, 15], italics: true, fontSize: 8, text: 'Disclaimer: The learning path has been created by ETNAT pilot version and may differ from the results to be obtained in the ETNAT full version.' },

            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 5],
                },
                headerFrame: {
                    margin: [0, 0, 0, 10],
                    fontSize: 9,
                    bold: true,
                },
                colValText: {
                    fontSize: 9,
                    alignment: 'left',
                    margin: [2, 0, 0, 0],
                    bold: false,

                }
            }
        };



    generate(data) {
        this.docDefinition.info.title=data.savedName;
        this.docDefinition.info.subject='My learning path';
        this.docDefinition.content.push(this.headerFrame(data));
        data.suggestedModules.forEach((module) => {
            this.docDefinition.content.push(this.moduleFrame(module));
        })

        pdfMake.createPdf(this.docDefinition).open();
    }

    headerFrame(data = null) {
        return {
            style: 'headerFrame',

            table: {

                widths: ['*', '*', '*'],
                headerRows: 1,
                // keepWithHeaderRows: 1,
                body: [
                    [{
                        columns: [
                            {
                                width: 'auto',
                                text: 'Name:'

                            },
                            {
                                width: '*',
                                text: data.savedName,
                                style: 'colValText'

                            }],

                        border: [true, true, false, false]
                    },

                    {
                        columns: [
                            {
                                width: 'auto',
                                text: 'Member State:',

                            },
                            {
                                width: '*',
                                text: store.getters.user.profile.country?store.getters.user.profile.country.name:'-',
                                style: 'colValText'
                            }],

                        border: [false, true, false, false]
                    },

                    {
                        columns: [
                            {
                                width: 'auto',
                                text: 'Institution:'
                            },
                            {
                                width: '*',
                                text: store.getters.user.profile.institution?store.getters.user.profile.institution.name:'-',
                                style: 'colValText'
                            }],

                        border: [false, true, true, false]
                    },


                    ],
                    [{ text: " ", border: [true, false, false, false] },
                    { text: " ", border: [false, false, false, false] },

                    { text: " ", border: [false, false, true, false] }
                    ],
                    [{

                        columns: [
                            {
                                width: 'auto',
                                text: 'Learning path created on:',

                            },
                            {
                                width: '*',
                                text: this.formatDate(data.savedDate),
                                style: 'colValText'
                            }],

                        colSpan: 3, border: [true, false, true, true]
                    }],

                ]
            }
        };
    }

    formatDate(date) {
        return moment(String(date)).format('DD. MM. YYYY - hh:mm')
    }
    moduleFrame(module = null) {
        var loTable = this.moduleLOFrame(module);
        var result = {
            style: 'headerFrame',
            table: {

                widths: ['*'],
                body: [
                    [{ text: module.description, border: [true, true, true, false], color: 'blue' }],
                    [{ text: [{ text: 'Module aim:' }, { text: module.moduleAim, bold: false, margin: [2, 0, 0, 0] }], border: [true, false, true, false] }],
                    [{
                        table: loTable,
                        margin: [0, 0, 0, 0],
                        border: [true, false, true, true],
                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return (rowIndex > 0 && loTable.body[rowIndex][3].text !== '-') ? '#CCCCCC' : null;
                            }
                        }


                    }
                    ]]
            }
        };

        return result;
    }

    moduleLOFrame(data) {
        var result = {
            widths: [20, '*', '*', '*'],
            //headerRows: 1,
            //keepWithHeaderRows: 1,
            body: [
                [

                    '', { text: 'Learning outcome' }, 'Type of learning', 'My selected tasks'],

            ],

        }

        data.learningOutcomes.forEach((lo) => {
            if (lo.suggestedTask) {
                result.body.push([

                    { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA70lEQVQ4T6XTu0oDQRSH8V80iL6D+CjpBBsLC0VNbbxho01ewUaw8k7wEgsLQWsbH8TGF1EOzMCw7ErWbLdn5vvOmf/sdkz5dKbk/UcwgxEWsdpWMIt79NPkH20EAT9guzj27aSCgB+xVcB32AnBQlr8xnFNqAE/YbPsjAF+QvCJXlo8w0mxsYsxNoraDXYDjloIrpIt7znFEAE/Y70JzoK4lggnJxv1cyxhrYCvsZc753oOMbq9VIAyjphyvwrnCfLGObxhpRLkJQ7q4Kog3ufxjuUkucBhE1wniFpc6yu+cPQX3CRo9X9N+iU2Sn8BrMElctzif/IAAAAASUVORK5CYII=' }

                    , lo.description, lo.type, lo.suggestedTask.description]);
            } else {
                result.body.push(['', lo.description, lo.type, '-']);
            }
        })
        return result;
    }

}
export default new PdfService();



















