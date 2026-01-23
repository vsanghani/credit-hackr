export const cardsData = [
    // --- CASHBACK SPECIAL ---
    {
        id: 13,
        name: "Amex Cashback Gold",
        image: "https://placehold.co/600x400/d4af37/ffffff?text=Amex+Cashback+Gold",
        category: "Cashback",
        feature: "5% Cashback for first 3 months",
        description: "The gold standard for cashback. Earn real money back on every purchase.",
        fees: {
            annual: 120, // often waived first year promo, but keeping base
            foreign: 3
        },
        interestRate: 20.74,
        pointsRate: "1.5% Cashback",
        benefits: [
            "Smartphone Screen Insurance",
            "Emergency Card Replacement",
            "Refund Protection"
        ],
        applyLink: "https://www.americanexpress.com/au/credit-cards/cashback-gold-card/"
    },
    // --- REWARDS / POINTS CARDS ---
    {
        id: 1,
        name: "Qantas Amex Ultimate",
        image: "https://placehold.co/600x400/e60000/ffffff?text=Qantas+Amex+Ultimate",
        category: "Points",
        feature: "Up to 100k Bonus Qantas Points",
        description: "A top-tier card for serious Qantas Frequent Flyers. Includes a $450 yearly travel credit.",
        fees: {
            annual: 450,
            foreign: 3
        },
        interestRate: 20.74,
        pointsRate: "1.25 Qantas Pts / $1",
        benefits: [
            "$450 Qantas Travel Credit each year",
            "Comp. International Travel Insurance",
            "2 Qantas Club Lounge passes"
        ],
        applyLink: "https://www.americanexpress.com/au/credit-cards/qantas-ultimate-card/"
    },
    {
        id: 2,
        name: "Westpac Altitude Black",
        image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Westpac+Altitude+Black",
        category: "Points",
        feature: "120k Bonus Altitude Points",
        description: "Luxury travel perks with your choice of Altitude, Qantas, or Velocity rewards programs.",
        fees: {
            annual: 295,
            foreign: 3
        },
        interestRate: 19.99,
        pointsRate: "1.25 Pts / $1",
        benefits: [
            "Unlimited Airport Lounge Access (Priority Pass)",
            "Comprehensive Travel Insurance",
            "Personal Concierge Service"
        ],
        applyLink: "https://www.westpac.com.au/personal-banking/credit-cards/reward/altitude-black/"
    },
    {
        id: 3,
        name: "NAB Rewards Signature",
        image: "https://placehold.co/600x400/bf0d3e/ffffff?text=NAB+Rewards+Signature",
        category: "Points",
        feature: "120k Bonus Rewards Points",
        description: "Earn double points on purchases at major hardware and department stores.",
        fees: {
            annual: 295,
            foreign: 3
        },
        interestRate: 19.99,
        pointsRate: "1.25 Pts / $1",
        benefits: [
            "Double points at Myer, David Jones, Bunnings",
            "Complimentary Overseas Travel Insurance",
            "Visa Signature Benefits"
        ],
        applyLink: "https://www.nab.com.au/personal/credit-cards/nab-rewards-signature-card"
    },
    {
        id: 4,
        name: "ANZ Rewards Black",
        image: "https://placehold.co/600x400/004165/ffffff?text=ANZ+Rewards+Black",
        category: "Points",
        feature: "180k Bonus Rewards Points",
        description: "Huge bonus points offer and significant cashback benefits for new customers.",
        fees: {
            annual: 375,
            foreign: 3
        },
        interestRate: 20.24,
        pointsRate: "2 Pts / $1",
        benefits: [
            "$100 Cash back offer",
            "Complimentary Travel Insurances",
            "Exclusives Extras & Entertainment"
        ],
        applyLink: "https://www.anz.com.au/personal/credit-cards/rewards/black/"
    },
    {
        id: 5,
        name: "Amex Velocity Platinum",
        image: "https://placehold.co/600x400/006fcf/ffffff?text=Amex+Velocity+Platinum",
        category: "Points",
        feature: "100k Bonus Velocity Points",
        description: "The fastest way to earn Velocity points on everyday spend. Includes a free domestic flight.",
        fees: {
            annual: 375,
            foreign: 3
        },
        interestRate: 20.74,
        pointsRate: "1.25 Velocity Pts / $1",
        benefits: [
            "Complimentary return domestic flight each year",
            "2 Virgin Australia Lounge passes",
            "Travel & Smartphone Screen Insurance"
        ],
        applyLink: "https://www.americanexpress.com/au/credit-cards/velocity-platinum-card/"
    },

    // --- LOW INTEREST CARDS ---
    {
        id: 6,
        name: "Westpac Lite Card",
        image: "https://placehold.co/600x400/da1710/ffffff?text=Westpac+Lite",
        category: "Low Interest",
        feature: "Super Low 9.90% p.a. rate",
        description: "No foreign transaction fees and a rock-bottom interest rate for purchases.",
        fees: {
            annual: 108, // $9/month
            foreign: 0
        },
        interestRate: 9.90,
        pointsRate: "N/A",
        benefits: [
            "0% Foreign Transaction Fees",
            "No late payment fees",
            "Access to Westpac Extras"
        ],
        applyLink: "https://www.westpac.com.au/personal-banking/credit-cards/low-rate/lite-card/"
    },
    {
        id: 7,
        name: "Amex Low Rate Card",
        image: "https://placehold.co/600x400/2671b9/ffffff?text=Amex+Low+Rate",
        category: "Low Interest",
        feature: "Low 10.99% p.a. rate",
        description: "A rare low-rate card that carries no annual fee at all.",
        fees: {
            annual: 0,
            foreign: 3
        },
        interestRate: 10.99,
        pointsRate: "N/A",
        benefits: [
            "$0 Annual Fee",
            "Access to Amex Offers",
            "Purchase Protection"
        ],
        applyLink: "https://www.americanexpress.com/au/credit-cards/low-rate-credit-card/"
    },
    {
        id: 8,
        name: "Coles Low Rate Mastercard",
        image: "https://placehold.co/600x400/e01a22/ffffff?text=Coles+Low+Rate",
        category: "Low Interest",
        feature: "12.99% p.a. purchase rate",
        description: "Save on interest while collecting Flybuys points on your grocery shop.",
        fees: {
            annual: 0,
            foreign: 3
        },
        interestRate: 12.99,
        pointsRate: "0.5 Flybuys / $1",
        benefits: [
            "$0 Annual Fee",
            "Collect Flybuys points",
            "Up to 55 days interest free"
        ],
        applyLink: "https://www.coles.com.au/credit-cards/low-rate-mastercard"
    },

    // --- CASHBACK / NO FEE CARDS ---
    {
        id: 9,
        name: "Coles No Annual Fee",
        image: "https://placehold.co/600x400/de1f26/ffffff?text=Coles+No+Fee",
        category: "Cashback",
        feature: "$0 Annual Fee Forever",
        description: "The budget-friendly way to boost your Flybuys balance without paying fees.",
        fees: {
            annual: 0,
            foreign: 3
        },
        interestRate: 19.99,
        pointsRate: "0.5 Flybuys / $1",
        benefits: [
            "No Annual Fee",
            "Free delivery on Coles Online orders over $50",
            "Complimentary Purchase Protection Insurance"
        ],
        applyLink: "https://www.coles.com.au/credit-cards/no-annual-fee-mastercard"
    },
    {
        id: 10,
        name: "ING Orange One Low Rate",
        image: "https://placehold.co/600x400/ff6200/ffffff?text=ING+Orange+One",
        category: "Low Interest",
        feature: "12.99% p.a. variable rate",
        description: "A straightforward card from Australia's most recommended bank.",
        fees: {
            annual: 48, // Waived if you are an Orange Everyday customer in some cases, but listing base
            foreign: 0 // If requirements met, but base 3% otherwise? Let's keep simple 0 for 'good' scenario or 3 for safety. ING refunds it. Let's say 0 with asterisk logic typically. Sticking to 0 for simplicity of "Best Case"
        },
        interestRate: 12.99,
        pointsRate: "N/A",
        benefits: [
            "No International Transaction Fees (eligibility applies)",
            "Low annual fee",
            "Mobile payments enabled"
        ],
        applyLink: "https://www.campaigns.ing.com.au/credit-cards/orange-one"
    },
    {
        id: 11,
        name: "CommBank Neo",
        image: "https://placehold.co/600x400/ffcc00/000000?text=CommBank+Neo",
        category: "Cashback",
        feature: "0% Interest - Fixed Fee",
        description: "A subscription-style credit card. Pay a simple monthly fee and never pay interest.",
        fees: {
            annual: 144, // $12/month for $1000 limit approx
            foreign: 3
        },
        interestRate: 0,
        pointsRate: "Cashback at partners",
        benefits: [
            "0% Interest rate details",
            "Earn CommBank Awards cashback at partners",
            "No late fees"
        ],
        applyLink: "https://www.commbank.com.au/credit-cards/neo.html"
    },
    {
        id: 12,
        name: "Kogan Money Black",
        image: "https://placehold.co/600x400/000000/ffffff?text=Kogan+Money+Black",
        category: "Points",
        feature: "$400 Kogan Credit Offer",
        description: "Earn rewards on your Kogan.com shopping and everywhere else.",
        fees: {
            annual: 0,
            foreign: 3
        },
        interestRate: 20.99,
        pointsRate: "2 Pts / $1 at Kogan",
        benefits: [
            "No Annual Fee",
            "Comp. Kogan First Membership",
            "Fast approval process"
        ],
        applyLink: "https://www.koganmoney.com.au/credit-cards/"
    }
];
