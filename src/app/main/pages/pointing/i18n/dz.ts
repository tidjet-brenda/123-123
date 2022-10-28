export const locale = {
    lang: 'dz',
    data: {
        pointing: {
            headers: {
                entry: 'Pointer votre entrée',
                exit: 'Pointer votre sortie',
                plannings:'Mon planning'
            },
            errors: {
                notInPositionError: 'La position détectée n\'est pas dans un rayon de 100m.',
                E360: 'Aucune entrée trouvée pour ce pointage',
                E344: 'Pointage rejeté, Vous n\'êtes pas autorisé à pointer les entrées/sorties',
                E322: 'Veuillez attendre au moins 60 secondes avant de pointer votre sortie',
                E316: 'Vous ne pouvez plus pointer des entrés/sorties',
                E323: 'Chevauchement d\'entrée/sortie',
                E321: 'Pointage rejeté, Maximum d\'heures pointées supérieur au max',
                E359: 'La position détectée n\'est pas dans un rayon de 100m.',
                notvalid: 'Code QR non reconnu, Veuillez scanner le bon code QR',
                noQrCode: 'Pas de QR code detecté',
                geolocateNotSupported: 'la fonctionnalité de geolocalisation n\'est pas disponible sur votre dispositif',
                noDevice: 'Aucune camera detectée, veuillez brancher une camera svp',
                scanFailure: 'Le scann a echoué, veuillez réesayez svp',
                scanError: 'Une erreur est survenu lors du scann, veuillez réesayez svp',
                positionTimeout: 'Un problème est survenu à la récupération de votre position , veuillez réesayez svp',
                positionUnavailable: 'La position détecté n\'est pas correcte, veuillez réesayez svp',
                positionPermissionDenied:'Votre position n\'a pas pu être recupérée, veuillez svp donner l\'autorisation ' + 
                'à l\'application d\'acceder a votre géolocalisation.',
            },
            scannDone: 'QR code scanné avec succès',
            goToPointing: 'Aller dans pointages',
            retry: 'Réessayer',
            refresh: 'Rafrichir la position',
            reload: 'Actualiser',
            phoneDeviceRequired: 'Veuillez vous connecter avec un téléphone ou une tablette pour pointer une',
            entry: 'entrée',
            exit: 'sortie',
            monthsYears: 'Mois et Année',
            nbrDays: 'Nombre de jours',
            selectDate: 'Veuillez sélectionner une autre date',
            noPointing: 'Vous n\'avez aucun jour de pointage en',
            unite: 'entrée / sortie',
            day: ' Jour',
            days: ' Jours',
            GET_POSITION: 'Récupération de votre position',
            TREAT_POSITION: 'Traitement des données récupérés',
            SEND_POSITION: 'Enregistrement des données récupérés',
            calendar: {
                title: 'Calendrier des plannings',
                tooltips: {
                    today: 'Aujourd\'hui',
                   // day: 'Jour',
                    week: 'Semaine',
                   // month: 'Mois',
                    expiredAbonnement: 'Votre abonnement a expiré'
                }
            },
            emptyPlaning:'Vous n\'êtes affectés à aucun planning'
        },
    

    }
};
