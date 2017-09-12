export default {
    supported: ["BTC_ETH", "USDT_BTC", "USDT_ETH", "ETH_BCH"],
    details: {
        BTC_ETH: {
            baseCurrency: "BTC",
            nextCurrency: "ETH",
            value: {
                last: "0.10000000",
                high: "0.20000000",
                low: "0.01000000",
                first: "0.10000000",
            },
            volume: "100.12340000",
        },
        USDT_BTC: {
            volume: "100.12340000",
            baseCurrency: "USDT",
            nextCurrency: "BTC",
            value: {
                last: "1000.00000000",
                high: "1500.00000000",
                low: "1000.00000000",
                first: "1000.00000000",
            },
        },
        USDT_ETH: {
            volume: "100.12340000",
            baseCurrency: "USDT",
            nextCurrency: "ETH",
            value: {
                last: "100.00000000",
                high: "200.00000000",
                low: "100.00000000",
                first: "100.00000000",
            },
        },
        ETH_BCH: {
            volume: "100.12340000",
            baseCurrency: "ETH",
            nextCurrency: "BCH",
            value: {
                last: "2.00000000",
                high: "3.00000000",
                low: "1.00000000",
                first: "1.00000000",
            },
        },
    },
};
