// Washington State Wineries and Travel Data
const washingtonWineries = [
    {
        id: 1,
        name: 'Chateau Ste. Michelle',
        region: 'Woodinville',
        coords: [47.7511, -122.1173],
        specialty: 'Riesling, Cabernet Sauvignon',
        description: 'Washington\'s founding winery with beautiful grounds, historic tours, and award-winning wines since 1934.',
        suitedFor: ['beginner', 'intermediate'],
        wineTypes: ['whites', 'reds'],
        priceLevel: 'moderate',
        tastingFee: 25,
        hours: '10:00 AM - 5:00 PM',
        phone: '(425) 415-3300',
        website: 'https://www.ste-michelle.com',
        features: ['Tours', 'Historic grounds', 'Gift shop', 'Events'],
        rating: 4.5
    },
    {
        id: 2,
        name: 'Leonetti Cellar',
        region: 'Walla Walla',
        coords: [46.0646, -118.3430],
        specialty: 'Cabernet Sauvignon, Merlot',
        description: 'Iconic family winery established in 1977, known for exceptional Bordeaux-style blends and cult following.',
        suitedFor: ['expert', 'professional'],
        wineTypes: ['reds'],
        priceLevel: 'luxury',
        tastingFee: 50,
        hours: 'By appointment only',
        phone: '(509) 525-1428',
        website: 'https://www.leonetticellar.com',
        features: ['By appointment', 'Limited production', 'Collector wines'],
        rating: 4.9
    },
    {
        id: 3,
        name: 'Columbia Crest',
        region: 'Columbia Valley',
        coords: [46.2596, -119.2751],
        specialty: 'Cabernet Sauvignon, Chardonnay',
        description: 'Large-scale producer with consistent quality, beautiful Columbia River views, and accessible pricing.',
        suitedFor: ['beginner', 'intermediate'],
        wineTypes: ['reds', 'whites'],
        priceLevel: 'budget',
        tastingFee: 15,
        hours: '10:00 AM - 6:00 PM',
        phone: '(509) 875-2061',
        website: 'https://www.columbiacrest.com',
        features: ['Scenic views', 'Large tasting room', 'Group friendly'],
        rating: 4.2
    },
    {
        id: 4,
        name: 'Quilceda Creek Vintners',
        region: 'Snohomish',
        coords: [47.8635, -122.1015],
        specialty: 'Cabernet Sauvignon',
        description: 'Consistently rated among Washington\'s best Cabernet producers with multiple 100-point wines.',
        suitedFor: ['expert', 'professional'],
        wineTypes: ['reds'],
        priceLevel: 'luxury',
        tastingFee: 75,
        hours: 'Saturday & Sunday 12:00 PM - 4:00 PM',
        phone: '(425) 481-8300',
        website: 'https://www.quilcedacreek.com',
        features: ['Weekend only', 'Premium wines', 'Small production'],
        rating: 4.8
    },
    {
        id: 5,
        name: 'Charles Smith Wines',
        region: 'Walla Walla',
        coords: [46.0646, -118.3430],
        specialty: 'Syrah, unique blends',
        description: 'Rock and roll winemaker creating bold, artistic wines with distinctive labels and edgy atmosphere.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds', 'natural'],
        priceLevel: 'moderate',
        tastingFee: 30,
        hours: '11:00 AM - 6:00 PM',
        phone: '(509) 526-5230',
        website: 'https://www.charlessmithwines.com',
        features: ['Rock music', 'Artistic labels', 'Urban tasting room'],
        rating: 4.4
    },
    {
        id: 6,
        name: 'L\'Ecole No 41',
        region: 'Walla Walla',
        coords: [46.0646, -118.3430],
        specialty: 'Semillon, Merlot, Cabernet Franc',
        description: 'Historic schoolhouse winery known for exceptional Bordeaux varietals and sustainable practices.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds', 'whites'],
        priceLevel: 'moderate',
        tastingFee: 40,
        hours: '10:00 AM - 5:00 PM',
        phone: '(509) 525-0940',
        website: 'https://www.lecole.com',
        features: ['Historic building', 'Sustainable', 'Educational tours'],
        rating: 4.6
    },
    {
        id: 7,
        name: 'Woodhouse Wine Estates',
        region: 'Woodinville',
        coords: [47.7511, -122.1173],
        specialty: 'Small lot wines from various regions',
        description: 'Multiple labels under one roof showcasing Washington\'s diversity with intimate tasting experiences.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds', 'whites'],
        priceLevel: 'moderate',
        tastingFee: 35,
        hours: '12:00 PM - 6:00 PM',
        phone: '(425) 527-0608',
        website: 'https://www.woodhousewineestates.com',
        features: ['Multiple labels', 'Intimate setting', 'Educational'],
        rating: 4.3
    },
    {
        id: 8,
        name: 'Cayuse Vineyards',
        region: 'Walla Walla',
        coords: [46.0646, -118.3430],
        specialty: 'Syrah, Grenache, Tempranillo',
        description: 'Biodynamic winery producing intense, terroir-driven Rhône varietals with cult following.',
        suitedFor: ['expert', 'professional'],
        wineTypes: ['reds', 'natural'],
        priceLevel: 'luxury',
        tastingFee: 60,
        hours: 'By appointment only',
        phone: '(509) 526-0686',
        website: 'https://www.cayusevineyards.com',
        features: ['Biodynamic', 'By appointment', 'Rhône varietals'],
        rating: 4.7
    },
    {
        id: 9,
        name: 'Hedges Family Estate',
        region: 'Red Mountain',
        coords: [46.2808, -119.4103],
        specialty: 'Cabernet Sauvignon, Syrah',
        description: 'Sustainable family winery with stunning Red Mountain views and French-American wine heritage.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds'],
        priceLevel: 'moderate',
        tastingFee: 25,
        hours: '11:00 AM - 5:00 PM',
        phone: '(509) 391-6056',
        website: 'https://www.hedgesfamilyestate.com',
        features: ['Mountain views', 'Sustainable', 'Family owned'],
        rating: 4.4
    },
    {
        id: 10,
        name: 'Kiona Vineyards',
        region: 'Red Mountain',
        coords: [46.2808, -119.4103],
        specialty: 'Lemberger, Ice Wine, Riesling',
        description: 'Family-owned pioneer on Red Mountain known for unique varietals and dessert wines.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds', 'whites', 'dessert'],
        priceLevel: 'moderate',
        tastingFee: 20,
        hours: '12:00 PM - 5:00 PM',
        phone: '(509) 588-6716',
        website: 'https://www.kionawine.com',
        features: ['Unique varietals', 'Ice wine', 'Family owned'],
        rating: 4.2
    },
    {
        id: 11,
        name: 'Gramercy Cellars',
        region: 'Walla Walla',
        coords: [46.0646, -118.3430],
        specialty: 'Syrah, Tempranillo, Grenache',
        description: 'Master Sommelier-owned winery focusing on Rhône and Spanish varietals with exceptional food pairings.',
        suitedFor: ['expert', 'professional'],
        wineTypes: ['reds'],
        priceLevel: 'premium',
        tastingFee: 45,
        hours: 'Friday-Sunday 11:00 AM - 4:00 PM',
        phone: '(509) 876-2427',
        website: 'https://www.gramercycellars.com',
        features: ['Sommelier owned', 'Food pairings', 'Spanish varietals'],
        rating: 4.6
    },
    {
        id: 12,
        name: 'Januik Winery',
        region: 'Woodinville',
        coords: [47.7511, -122.1173],
        specialty: 'Cabernet Sauvignon, Syrah, Chardonnay',
        description: 'Boutique winery focusing on single-vineyard expressions with meticulous attention to detail.',
        suitedFor: ['intermediate', 'expert'],
        wineTypes: ['reds', 'whites'],
        priceLevel: 'moderate',
        tastingFee: 30,
        hours: '12:00 PM - 6:00 PM',
        phone: '(425) 481-5502',
        website: 'https://www.januik.com',
        features: ['Single vineyard', 'Boutique', 'Educational'],
        rating: 4.5
    }
];

const restaurants = [
    {
        id: 1,
        name: 'The Herbfarm',
        location: 'Woodinville',
        coords: [47.7511, -122.1173],
        cuisine: 'Pacific Northwest',
        description: 'Nine-course tasting menu with wine pairings from their 20,000-bottle cellar',
        priceLevel: 'luxury',
        phone: '(425) 485-5300',
        reservations: 'Required',
        dressCode: 'Smart casual',
        features: ['Tasting menu', 'Wine pairings', 'Seasonal ingredients'],
        rating: 4.8
    },
    {
        id: 2,
        name: 'Whitehouse-Crawford',
        location: 'Walla Walla',
        coords: [46.0646, -118.3430],
        cuisine: 'American',
        description: 'Historic setting with locally-sourced ingredients and extensive Washington wine list',
        priceLevel: 'moderate',
        phone: '(509) 525-2222',
        reservations: 'Recommended',
        dressCode: 'Casual',
        features: ['Historic building', 'Local ingredients', 'Wine list'],
        rating: 4.5
    },
    {
        id: 3,
        name: 'Barking Frog',
        location: 'Woodinville',
        coords: [47.7511, -122.1173],
        cuisine: 'Pacific Northwest',
        description: 'Farm-to-table dining at Willows Lodge with wine country views',
        priceLevel: 'moderate',
        phone: '(425) 424-2999',
        reservations: 'Recommended',
        dressCode: 'Smart casual',
        features: ['Farm to table', 'Wine country views', 'Seasonal menu'],
        rating: 4.4
    },
    {
        id: 4,
        name: 'Brasserie Four',
        location: 'Walla Walla',
        coords: [46.0646, -118.3430],
        cuisine: 'French',
        description: 'Classic French bistro with rotating seasonal menu and extensive wine selection',
        priceLevel: 'moderate',
        phone: '(509) 529-2011',
        reservations: 'Recommended',
        dressCode: 'Casual',
        features: ['French cuisine', 'Seasonal menu', 'Wine selection'],
        rating: 4.3
    },
    {
        id: 5,
        name: 'Purple Café and Wine Bar',
        location: 'Woodinville',
        coords: [47.7511, -122.1173],
        cuisine: 'American',
        description: 'Casual wine bar with extensive selection and shareable plates',
        priceLevel: 'budget',
        phone: '(425) 483-7129',
        reservations: 'Not required',
        dressCode: 'Casual',
        features: ['Wine bar', 'Shareable plates', 'Casual atmosphere'],
        rating: 4.1
    }
];

const accommodations = [
    {
        id: 1,
        name: 'Willows Lodge',
        location: 'Woodinville',
        coords: [47.7511, -122.1173],
        type: 'Luxury Resort',
        description: 'Elegant lodge surrounded by gardens with spa services and wine country charm',
        priceLevel: 'luxury',
        amenities: ['Spa', 'Fine dining', 'Garden views', 'Pet-friendly', 'Concierge'],
        rating: 4.7
    },
    {
        id: 2,
        name: 'Inn at Abeja',
        location: 'Walla Walla',
        coords: [46.0646, -118.3430],
        type: 'Boutique Inn',
        description: 'Historic farmhouse on working vineyard with gourmet breakfast and wine tastings',
        priceLevel: 'boutique',
        amenities: ['Vineyard views', 'Gourmet breakfast', 'Historic charm', 'Wine tastings'],
        rating: 4.6
    },
    {
        id: 3,
        name: 'Hampton Inn & Suites Woodinville',
        location: 'Woodinville',
        coords: [47.7511, -122.1173],
        type: 'Hotel',
        description: 'Modern hotel with easy access to wine country and complimentary amenities',
        priceLevel: 'budget',
        amenities: ['Free breakfast', 'Pool', 'Fitness center', 'Business center'],
        rating: 4.2
    },
    {
        id: 4,
        name: 'Marcus Whitman Hotel',
        location: 'Walla Walla',
        coords: [46.0646, -118.3430],
        type: 'Historic Hotel',
        description: 'Renovated 1928 hotel in downtown Walla Walla with modern amenities',
        priceLevel: 'moderate',
        amenities: ['Historic charm', 'Downtown location', 'Restaurant', 'Event spaces'],
        rating: 4.3
    }
];

const wineRegions = [
    {
        name: 'Columbia Valley',
        description: 'Washington\'s largest AVA, known for diverse varietals and microclimates',
        bestFor: ['reds', 'whites'],
        keyWineries: ['Columbia Crest', 'Chateau Ste. Michelle'],
        drivingTime: '2-3 hours from Seattle'
    },
    {
        name: 'Walla Walla Valley',
        description: 'Historic region famous for premium reds and boutique wineries',
        bestFor: ['reds'],
        keyWineries: ['Leonetti Cellar', 'L\'Ecole No 41', 'Charles Smith Wines'],
        drivingTime: '4-5 hours from Seattle'
    },
    {
        name: 'Woodinville',
        description: 'Convenient wine destination near Seattle with tasting rooms',
        bestFor: ['variety', 'convenience'],
        keyWineries: ['Chateau Ste. Michelle', 'Januik Winery'],
        drivingTime: '30 minutes from Seattle'
    },
    {
        name: 'Red Mountain',
        description: 'Small but prestigious region known for powerful reds',
        bestFor: ['reds'],
        keyWineries: ['Hedges Family Estate', 'Kiona Vineyards'],
        drivingTime: '3-4 hours from Seattle'
    }
];

// Export for use in main application
if (typeof window !== 'undefined') {
    window.wineData = {
        wineries: washingtonWineries,
        restaurants: restaurants,
        accommodations: accommodations,
        regions: wineRegions
    };
}