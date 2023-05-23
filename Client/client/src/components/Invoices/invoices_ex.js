
export const invoiceExample = [
    {
        invoiceType: "Invoice",
        id: "253929",
        date: "2023-05-22 18:00:00.000",
        remitToParty: {
            partyId: "1252",
            address: {
                name: "Andrew Fia",
                addressLine1: "2934 Some St",
                city: "Glendale",
                county: "Los Angeles",
                stateOrRegion: "CA",
                phone: "5322315923",
            }
        },
        invoiceTotal: {
            currencyCode: "USD",
            amount: 12180.92,
        },
        items: [
            {
                itemSequenceNumber: 1,
                amazonProductIdentifier: "ASINTEST01",
                netCost: {
                    amount: 99.99,
                },
                invoicedQuantity: {
                    amount: 23,
                    unitOfMeasure: "Eaches",
                }
            },
            {
                itemSequenceNumber: 2,
                amazonProductIdentifier: "ASINTEST05",
                netCost: {
                    amount: 964.55,
                },
                invoicedQuantity: {
                    amount: 5,
                    unitOfMeasure: "Eaches",
                }
            },
            {
                itemSequenceNumber: 3,
                amazonProductIdentifier: "ASINTEST08",
                netCost: {
                    amount: 63.23,
                },
                invoicedQuantity: {
                    amount: 80,
                    unitOfMeasure: "Eaches",
                }
            },
        ]
    }, 
    {
        invoiceType: "Invoice",
        id: "241932",
        date: "2023-05-21 14:00:00.000",
        remitToParty: {
            partyId: "1252",
            address: {
                name: "Andrew Fia",
                addressLine1: "2934 Some St",
                city: "Glendale",
                county: "Los Angeles",
                stateOrRegion: "CA",
                phone: "5322315923",
            }
        },
        invoiceTotal: {
            currencyCode: "USD",
            amount: 1180.92,
        },
        items: [
            {
                itemSequenceNumber: 1,
                amazonProductIdentifier: "ASINTEST01",
                netCost: {
                    amount: 19.99,
                },
                invoicedQuantity: {
                    amount: 23,
                    unitOfMeasure: "Eaches",
                }
            },
            {
                itemSequenceNumber: 2,
                amazonProductIdentifier: "ASINTEST05",
                netCost: {
                    amount: 364.55,
                },
                invoicedQuantity: {
                    amount: 5,
                    unitOfMeasure: "Eaches",
                }
            },
            {
                itemSequenceNumber: 3,
                amazonProductIdentifier: "ASINTEST08",
                netCost: {
                    amount: 63.13,
                },
                invoicedQuantity: {
                    amount: 25,
                    unitOfMeasure: "Eaches",
                }
            },
        ]
    }, 
]
 