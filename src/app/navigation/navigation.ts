import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: '',
        title: '',
        translate: '',
        type: 'group',
        children: [
            {
                id: 'employee-personal-informations',
                title: 'employee-personal-informations',
                translate: 'NAV.EMPLOYEE_PERSONAL_INFORMATIONS.TITLE',
                type: 'item',
                url: '/employee-personal-informations',
                hidden: true,

            },

            {
                id: 'employee-professional-infomations',
                title: 'Mon profile',
                translate: 'NAV.EMPLOYEE_PROFESSIONAL_INFORMATIONS.TITLE',
                type: 'item',
                icon: 'people_alt',
                url: '/employee-professional-infomations',

            },

            {
                id: 'leave',
                title: 'leave',
                translate: 'NAV.LEAVE.TITLE',
                type: 'item',
                icon: 'leave',
                svgIcon: true,
                url: '/leave',
            },
            {
                id: 'absence',
                title: 'Absence',
                translate: 'NAV.ABSENCE.TITLE',
                type: 'item',
                icon: 'absence',
                svgIcon: true,
                url: '/absence',
            },

            {
                id: 'payslip',
                title: 'payslip',
                translate: 'NAV.PAYSLIP.TITLE',
                type: 'item',
                icon: 'payroll',
                svgIcon: true,
                url: '/payslip',
            },

            {
                id: 'pointing',
                title: 'Pointing',
                translate: 'NAV.POINTAGE.TITLE',
                type: 'collapsable',
                icon: 'time',
                svgIcon: true,
               children: [
                   {
                    id: 'plannings',
                    title: 'plannings',
                    translate: 'NAV.PLANNINGS.TITLE',
                    type: 'item',
                    icon: '',
                    url: '/pointing/plannings',
                   },
                   {
                    id: 'my-pointings',
                    title: 'Pointing',
                    translate: 'NAV.VIEW_POINTING.TITLE',
                    type: 'item',
                    icon: '',
                    url: '/pointing/my-pointings',
                   },
                   {
                    id: 'entry',
                    title: 'Entries',
                    translate: 'NAV.ENTRIES.TITLE',
                    type: 'item',
                    icon: '',
                    url: '/pointing/entry',
                   },
                   {
                    id: 'exit',
                    title: 'Exits',
                    translate: 'NAV.EXITS.TITLE',
                    type: 'item',
                    icon: '',
                    url: '/pointing/exit',
                   },
               ]
            },
        ]
    }
];
