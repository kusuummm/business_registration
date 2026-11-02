export interface TrademarkClass {
  classNumber: number;
  type: 'Goods' | 'Services';
  title: string;
  summary: string;
  popularGoodsServices: string[];
  keywords: string[];
}

export const TRADEMARK_CLASSES: TrademarkClass[] = [
  {
    classNumber: 1,
    type: 'Goods',
    title: 'Chemicals for Industry, Science & Agriculture',
    summary: 'Chemicals used in industry, science, photography, agriculture, horticulture, and forestry.',
    popularGoodsServices: ['Fertilizers', 'Synthetic resins', 'Industrial adhesives', 'Chemical reagents', 'Soil conditioners'],
    keywords: ['chemical', 'fertilizer', 'resin', 'adhesive', 'agriculture', 'raw plastic', 'science']
  },
  {
    classNumber: 2,
    type: 'Goods',
    title: 'Paints, Varnishes & Anti-Corrosion',
    summary: 'Paints, varnishes, lacquers, preservatives against rust and deterioration of wood, colorants, mordants.',
    popularGoodsServices: ['Wall paints', 'Wood varnishes', 'Anti-rust coatings', 'Printing inks', 'Dyes and pigments'],
    keywords: ['paint', 'varnish', 'lacquer', 'coating', 'dye', 'pigment', 'colorant', 'rust']
  },
  {
    classNumber: 3,
    type: 'Goods',
    title: 'Cosmetics, Skincare, Cleaning & Perfumery',
    summary: 'Non-medicated cosmetics, soaps, perfumes, essential oils, hair lotions, dentifrices, cleaning preparations.',
    popularGoodsServices: ['Skincare serums', 'Shampoos & conditioners', 'Perfumes & deodorants', 'Makeup & lipstick', 'Detergents & soaps'],
    keywords: ['cosmetic', 'skincare', 'makeup', 'perfume', 'shampoo', 'soap', 'deodorant', 'beauty', 'toothpaste', 'detergent', 'cleaning']
  },
  {
    classNumber: 4,
    type: 'Goods',
    title: 'Industrial Oils, Greases, Fuels & Candles',
    summary: 'Industrial oils, greases, lubricants, dust absorbing compositions, fuels, illuminants, candles and wicks.',
    popularGoodsServices: ['Motor engine oil', 'Industrial grease', 'Biofuels & petrol', 'Scented candles', 'Lamp wicks'],
    keywords: ['fuel', 'oil', 'lubricant', 'grease', 'candle', 'petrol', 'diesel', 'energy']
  },
  {
    classNumber: 5,
    type: 'Goods',
    title: 'Pharmaceuticals, Medical Preparations & Dietetics',
    summary: 'Pharmaceutical and veterinary preparations, dietetic substances for medical use, disinfectants, fungicides.',
    popularGoodsServices: ['Antibiotics & tablets', 'Ayurvedic medicines', 'Nutritional supplements', 'Antiseptic creams', 'Baby food formulas'],
    keywords: ['medicine', 'pharma', 'pharmaceutical', 'ayurveda', 'drug', 'supplement', 'vitamin', 'sanitizer', 'disinfectant']
  },
  {
    classNumber: 6,
    type: 'Goods',
    title: 'Common Metals & Hardware',
    summary: 'Common metals and their alloys, ores, metal building materials, small items of metal hardware, safes.',
    popularGoodsServices: ['Steel pipes & rods', 'Metal locks & hinges', 'Aluminum foil & sheets', 'Wire ropes', 'Metal containers'],
    keywords: ['metal', 'steel', 'iron', 'aluminum', 'hardware', 'lock', 'pipe', 'alloy', 'wire']
  },
  {
    classNumber: 7,
    type: 'Goods',
    title: 'Machines, Power Tools & Motors',
    summary: 'Machines, machine tools, motors and engines (except for land vehicles), machine coupling and transmission components.',
    popularGoodsServices: ['Industrial pumps', 'Electric generators', 'Agricultural harvesters', 'Robotics & automation units', 'Cutting machines'],
    keywords: ['machine', 'motor', 'engine', 'generator', 'pump', 'tool', 'robotics', 'lathe', 'industrial equipment']
  },
  {
    classNumber: 8,
    type: 'Goods',
    title: 'Hand Tools, Cutlery & Razors',
    summary: 'Hand tools and implements (hand-operated), cutlery, side arms, razors.',
    popularGoodsServices: ['Kitchen knives & spoons', 'Shaving razors & clippers', 'Hammers, screwdrivers & pliers', 'Garden shears', 'Nail clippers'],
    keywords: ['hand tool', 'knife', 'cutlery', 'razor', 'scissor', 'hammer', 'screwdriver', 'pliers', 'blade']
  },
  {
    classNumber: 9,
    type: 'Goods',
    title: 'Software, Electronics, Mobile Apps & Gadgets',
    summary: 'Scientific, research, navigation, audio-visual, optical, measuring, computing apparatus, downloadable software.',
    popularGoodsServices: ['Mobile applications & SaaS', 'Smartphones & laptops', 'AI and machine learning software', 'Wearable smartwatches', 'Earbuds & speakers'],
    keywords: ['software', 'app', 'mobile app', 'computer', 'electronics', 'saas', 'artificial intelligence', 'phone', 'gadget', 'iot', 'hardware', 'tech']
  },
  {
    classNumber: 10,
    type: 'Goods',
    title: 'Medical Devices, Instruments & PPE',
    summary: 'Surgical, medical, dental and veterinary apparatus and instruments, artificial limbs, orthopaedic articles.',
    popularGoodsServices: ['Diagnostic MRI machines', 'Surgical gloves & scalpels', 'Stethoscopes & BP monitors', 'Dental implants', 'Orthopedic braces'],
    keywords: ['medical device', 'surgical', 'dental', 'diagnostic', 'implant', 'hospital equipment', 'orthopedic', 'ppe']
  },
  {
    classNumber: 11,
    type: 'Goods',
    title: 'Lighting, Heating, Cooling & Sanitization',
    summary: 'Apparatus for lighting, heating, steam generating, cooking, refrigerating, drying, ventilating, water supply.',
    popularGoodsServices: ['LED bulbs & fixtures', 'Air conditioners & fans', 'Refrigerators & microwaves', 'Water purifiers & RO units', 'Solar water heaters'],
    keywords: ['lighting', 'light', 'fan', 'ac', 'air conditioner', 'refrigerator', 'heater', 'purifier', 'lamp', 'cooktop']
  },
  {
    classNumber: 12,
    type: 'Goods',
    title: 'Vehicles & Automotive Conveyances',
    summary: 'Vehicles, apparatus for locomotion by land, air or water, including automotive parts and bicycles.',
    popularGoodsServices: ['Electric vehicles (EVs)', 'Motorcycles & scooters', 'Cars, trucks & buses', 'Bicycles & e-bikes', 'Automobile spare parts'],
    keywords: ['vehicle', 'car', 'bike', 'motorcycle', 'ev', 'electric vehicle', 'scooter', 'automobile', 'bicycle', 'truck']
  },
  {
    classNumber: 13,
    type: 'Goods',
    title: 'Firearms & Pyrotechnics',
    summary: 'Firearms, ammunition and projectiles, explosives, fireworks.',
    popularGoodsServices: ['Sporting rifles', 'Ammunition cartridges', 'Festive fireworks & sparklers', 'Flares', 'Explosives for mining'],
    keywords: ['firearm', 'ammunition', 'firework', 'explosive', 'weapon', 'gun', 'pyrotechnics']
  },
  {
    classNumber: 14,
    type: 'Goods',
    title: 'Precious Metals, Jewellery & Watches',
    summary: 'Precious metals and their alloys, jewellery, precious and semi-precious stones, horological instruments.',
    popularGoodsServices: ['Gold & diamond rings', 'Luxury wristwatches', 'Silver necklaces', 'Gemstones & pearls', 'Fashion jewellery'],
    keywords: ['jewellery', 'jewelry', 'gold', 'diamond', 'watch', 'silver', 'gemstone', 'ring', 'necklace', 'luxury']
  },
  {
    classNumber: 15,
    type: 'Goods',
    title: 'Musical Instruments',
    summary: 'Musical instruments, music stands and stands for musical instruments, conductors’ batons.',
    popularGoodsServices: ['Acoustic & electric guitars', 'Pianos & synthesizers', 'Traditional sitars & tablas', 'Drums & percussion', 'Microphone stands'],
    keywords: ['musical instrument', 'guitar', 'piano', 'drums', 'music', 'sitar', 'tabla', 'violin']
  },
  {
    classNumber: 16,
    type: 'Goods',
    title: 'Paper, Books, Stationery & Packaging Materials',
    summary: 'Paper and cardboard, printed matter, bookbinding material, photographs, stationery, adhesives for stationery.',
    popularGoodsServices: ['Notebooks & printed books', 'Carton packaging boxes', 'Pens, pencils & markers', 'Paper bags', 'Office files & envelopes'],
    keywords: ['paper', 'stationery', 'book', 'packaging', 'pen', 'print', 'notebook', 'box', 'magazine']
  },
  {
    classNumber: 17,
    type: 'Goods',
    title: 'Rubber, Plastics, Insulation & Sealants',
    summary: 'Unprocessed and semi-processed rubber, gutta-percha, asbestos, plastics in extruded form, packing, stopping.',
    popularGoodsServices: ['Rubber tires & tubes', 'PVC pipes & fittings', 'Thermal insulation foam', 'Silicone sealant adhesives', 'Waterproofing sheets'],
    keywords: ['rubber', 'plastic', 'pipe', 'insulation', 'sealant', 'pvc', 'foam', 'waterproofing']
  },
  {
    classNumber: 18,
    type: 'Goods',
    title: 'Leather Goods, Luggage & Bags',
    summary: 'Leather and imitations of leather, animal skins, luggage and carrying bags, umbrellas and walking sticks, whips.',
    popularGoodsServices: ['Leather handbags & wallets', 'Travel trolley bags & backpacks', 'Leather jackets & belts', 'Briefcases', 'Umbrellas'],
    keywords: ['leather', 'bag', 'handbag', 'wallet', 'backpack', 'luggage', 'suitcase', 'belt', 'travel bag']
  },
  {
    classNumber: 19,
    type: 'Goods',
    title: 'Building Materials (Non-Metallic) & Tiles',
    summary: 'Materials, not of metal, for building and construction, rigid pipes for building, asphalt, pitch, non-metallic monuments.',
    popularGoodsServices: ['Cement & ready-mix concrete', 'Ceramic floor & wall tiles', 'Plywood & timber boards', 'Granite, marble & stones', 'Glass for construction'],
    keywords: ['building material', 'cement', 'tile', 'plywood', 'marble', 'granite', 'concrete', 'stone', 'construction']
  },
  {
    classNumber: 20,
    type: 'Goods',
    title: 'Furniture, Mattresses & Home Decor',
    summary: 'Furniture, mirrors, picture frames, containers, not of metal, for storage or transport, unworked or semi-worked bone.',
    popularGoodsServices: ['Sofas, beds & wooden dining tables', 'Ergonomic office chairs', 'Orthopedic mattresses & pillows', 'Wall mirrors & photo frames', 'Modular wardrobes'],
    keywords: ['furniture', 'sofa', 'bed', 'chair', 'table', 'mattress', 'pillow', 'wardrobe', 'decor', 'mirror']
  },
  {
    classNumber: 21,
    type: 'Goods',
    title: 'Kitchenware, Cookware & Household Utensils',
    summary: 'Household or kitchen utensils and containers, cookware and tableware, combs and sponges, brushes, glassware, porcelain.',
    popularGoodsServices: ['Non-stick frying pans & pressure cookers', 'Stainless steel dinnerware', 'Glass water bottles & mugs', 'Storage jars & containers', 'Brooms & cleaning mops'],
    keywords: ['kitchenware', 'cookware', 'utensil', 'pan', 'bottle', 'mug', 'glassware', 'plate', 'container', 'household']
  },
  {
    classNumber: 22,
    type: 'Goods',
    title: 'Ropes, Nets, Tents, Tarpaulins & Sacks',
    summary: 'Ropes and string, nets, tents and tarpaulins, awnings of textile or synthetic materials, sails, sacks for transport.',
    popularGoodsServices: ['Nylon & jute ropes', 'Camping tents & tarpaulins', 'Grain packaging sacks', 'Fishing & safety nets', 'Cotton raw fiber'],
    keywords: ['rope', 'tent', 'tarpaulin', 'sack', 'net', 'jute', 'fiber', 'camping']
  },
  {
    classNumber: 23,
    type: 'Goods',
    title: 'Yarns and Threads for Textile Use',
    summary: 'Yarns and threads for textile use, embroidery, sewing and weaving.',
    popularGoodsServices: ['Cotton sewing thread', 'Polyester yarn for garment weaving', 'Woollen knitting yarn', 'Silk embroidery threads', 'Spun yarn'],
    keywords: ['yarn', 'thread', 'sewing', 'knitting', 'wool', 'cotton thread', 'embroidery']
  },
  {
    classNumber: 24,
    type: 'Goods',
    title: 'Textiles, Fabrics & Home Bedding',
    summary: 'Textiles and substitutes for textiles, household linen, curtains of textile or plastic.',
    popularGoodsServices: ['Bedsheets & pillow covers', 'Cotton & linen fabric bolts', 'Bath towels & bathrobes', 'Window curtains & drapes', 'Tablecloths & runners'],
    keywords: ['fabric', 'textile', 'bedsheet', 'towel', 'curtain', 'cloth', 'linen', 'blanket']
  },
  {
    classNumber: 25,
    type: 'Goods',
    title: 'Clothing, Footwear & Headgear',
    summary: 'Clothing, footwear, headgear for human wear across all age groups and occasions.',
    popularGoodsServices: ['T-shirts, shirts & denim jeans', 'Ethnic sarees, kurtis & lehengas', 'Running shoes & formal leather shoes', 'Caps, beanies & turbans', 'Innerwear & athleisure'],
    keywords: ['clothing', 'clothes', 'apparel', 'fashion', 'tshirt', 'shirt', 'dress', 'shoe', 'footwear', 'saree', 'kurti', 'sneaker']
  },
  {
    classNumber: 26,
    type: 'Goods',
    title: 'Lace, Ribbons, Zippers & Hair Accessories',
    summary: 'Lace, braid and embroidery, and haberdashery ribbons and bows, buttons, hooks and eyes, pins, hair decorations.',
    popularGoodsServices: ['Garment zippers & buttons', 'Hair clips & rubber bands', 'Embroidered lace borders', 'Sewing pins & needles', 'Artificial flowers'],
    keywords: ['button', 'zipper', 'lace', 'ribbon', 'hair clip', 'needle', 'accessories', 'haberdashery']
  },
  {
    classNumber: 27,
    type: 'Goods',
    title: 'Carpets, Rugs, Mats & Floor Coverings',
    summary: 'Carpets, rugs, mats and matting, linoleum and other materials for covering existing floors, wall hangings.',
    popularGoodsServices: ['Handmade woolen carpets', 'Yoga & exercise mats', 'Entrance doormats', 'Vinyl flooring rolls', 'Decorative wall tapestries'],
    keywords: ['carpet', 'rug', 'mat', 'yoga mat', 'flooring', 'doormat', 'wallpaper']
  },
  {
    classNumber: 28,
    type: 'Goods',
    title: 'Games, Toys, Fitness & Sporting Goods',
    summary: 'Games, toys and playthings, video game apparatus, gymnastic and sporting articles, decorations for Christmas trees.',
    popularGoodsServices: ['Cricket bats, balls & footballs', 'Gym dumbbells & treadmills', 'Board games & puzzles', 'Kids toy cars & dolls', 'Electronic gaming consoles'],
    keywords: ['toy', 'game', 'sports', 'fitness', 'gym', 'cricket', 'football', 'board game', 'puzzle', 'plaything']
  },
  {
    classNumber: 29,
    type: 'Goods',
    title: 'Meat, Dairy, Edible Oils, Dry Fruits & Processed Foods',
    summary: 'Meat, fish, poultry and game, meat extracts, preserved, frozen, dried and cooked fruits and vegetables, jellies, dairy.',
    popularGoodsServices: ['Milk, cheese, butter & paneer', 'Edible mustard, olive & sunflower oils', 'Almonds, cashews & dry fruits', 'Fruit jams & pickles', 'Frozen snacks & nuggets'],
    keywords: ['dairy', 'milk', 'cheese', 'oil', 'edible oil', 'dry fruit', 'meat', 'frozen food', 'pickle', 'jam', 'food']
  },
  {
    classNumber: 30,
    type: 'Goods',
    title: 'Coffee, Tea, Spices, Bakery, Flour & Confectionery',
    summary: 'Coffee, tea, cocoa, sugar, rice, tapioca, sago, flour, bread, pastries and confectionery, honey, spices, salt.',
    popularGoodsServices: ['CTC & green teas', 'Roasted coffee beans & instant coffee', 'Indian whole & ground spices', 'Chocolates, cookies & cakes', 'Atta, basmati rice & noodles'],
    keywords: ['tea', 'coffee', 'spice', 'bakery', 'biscuit', 'chocolate', 'bread', 'rice', 'flour', 'confectionery', 'snack', 'namkeen']
  },
  {
    classNumber: 31,
    type: 'Goods',
    title: 'Fresh Fruits, Vegetables, Grains & Pet Food',
    summary: 'Raw and unprocessed agricultural, aquacultural, horticultural and forestry products, raw grains, fresh fruits, pet food.',
    popularGoodsServices: ['Fresh organic fruits & vegetables', 'Agricultural crop seeds', 'Dog & cat dry food kibbles', 'Live plants & flowering shrubs', 'Cattle feeds'],
    keywords: ['fruit', 'vegetable', 'fresh', 'seed', 'pet food', 'dog food', 'plant', 'grain', 'agriculture']
  },
  {
    classNumber: 32,
    type: 'Goods',
    title: 'Beers, Mineral Waters, Juices & Soft Drinks',
    summary: 'Beers, non-alcoholic beverages, mineral and aerated waters, fruit beverages and fruit juices, syrups for drinks.',
    popularGoodsServices: ['Packaged mineral water', 'Cold-pressed fruit juices', 'Carbonated sodas & colas', 'Craft beer & ales', 'Energy & electrolyte drinks'],
    keywords: ['beverage', 'juice', 'water', 'mineral water', 'beer', 'soda', 'drink', 'energy drink', 'soft drink']
  },
  {
    classNumber: 33,
    type: 'Goods',
    title: 'Alcoholic Beverages (Except Beer)',
    summary: 'Alcoholic beverages (except beers), spirits, wines, liqueurs, ciders, distilled beverages.',
    popularGoodsServices: ['Single malt & blended whiskies', 'Red, white & sparkling wines', 'Vodka, gin & rum', 'Brandies & liqueurs', 'Fermented ciders'],
    keywords: ['alcohol', 'liquor', 'whisky', 'wine', 'rum', 'vodka', 'gin', 'brandy', 'spirit']
  },
  {
    classNumber: 34,
    type: 'Goods',
    title: 'Tobacco, Cigarettes & Smokers’ Articles',
    summary: 'Tobacco and tobacco substitutes, cigarettes and cigars, electronic cigarettes and oral vaporizers, smokers’ articles.',
    popularGoodsServices: ['Cigarettes & bidi rolls', 'Electronic vape devices', 'Chewing tobacco & gutkha', 'Lighters & matchboxes', 'Hookah flavors'],
    keywords: ['tobacco', 'cigarette', 'vape', 'smoker', 'lighter', 'cigar', 'bidi']
  },
  {
    classNumber: 35,
    type: 'Services',
    title: 'Advertising, Business Management & Retail / E-Commerce',
    summary: 'Advertising, business management, organization and administration, office functions, online retail and marketplace portals.',
    popularGoodsServices: ['E-commerce online marketplaces', 'Digital marketing & SEO agencies', 'Business consultancy & HR recruiting', 'Supermarket retail store operations', 'Accounting & bookkeeping services'],
    keywords: ['business', 'retail', 'ecommerce', 'e-commerce', 'marketing', 'advertising', 'agency', 'store', 'marketplace', 'hr', 'consulting', 'management']
  },
  {
    classNumber: 36,
    type: 'Services',
    title: 'Financial, Banking, Insurance & Real Estate Services',
    summary: 'Financial, monetary and banking services, insurance services, real estate affairs, investment brokerage.',
    popularGoodsServices: ['FinTech digital payment gateways', 'Life & health insurance brokerage', 'Real estate property consultancy', 'Mutual fund & stock broking', 'NBFC lending & loans'],
    keywords: ['finance', 'banking', 'fintech', 'insurance', 'loan', 'investment', 'real estate', 'property', 'wealth', 'brokerage', 'crypto']
  },
  {
    classNumber: 37,
    type: 'Services',
    title: 'Construction, Repair & Installation Services',
    summary: 'Construction services, installation and repair services, mining extraction, building maintenance.',
    popularGoodsServices: ['Civil residential construction', 'HVAC & electrical repair services', 'Automotive car repair & servicing', 'Elevator maintenance', 'Plumbing & pest control'],
    keywords: ['construction', 'repair', 'installation', 'maintenance', 'builder', 'plumbing', 'electrical', 'car service']
  },
  {
    classNumber: 38,
    type: 'Services',
    title: 'Telecommunications & Data Broadcasting',
    summary: 'Telecommunication services, broadcasting of television and radio, internet access provider services, communication portals.',
    popularGoodsServices: ['Mobile cellular network services', 'Broadband ISP internet access', 'Audio/Video streaming transmission', 'Satellite communications', 'VoIP call routing'],
    keywords: ['telecom', 'internet', 'broadband', 'streaming', 'broadcasting', 'isp', 'communication', 'voip', 'satellite']
  },
  {
    classNumber: 39,
    type: 'Services',
    title: 'Logistics, Transport, Travel & Warehousing',
    summary: 'Transport of goods and people, packaging and storage of goods, travel arrangement, courier and freight forwarding.',
    popularGoodsServices: ['Courier & parcel doorstep delivery', 'Cold storage & warehousing fulfillment', 'Ride-hailing cabs & taxi fleets', 'Air & ocean freight forwarding', 'Tour & travel itinerary booking'],
    keywords: ['transport', 'logistics', 'courier', 'delivery', 'cargo', 'warehousing', 'travel', 'cab', 'shipping', 'freight']
  },
  {
    classNumber: 40,
    type: 'Services',
    title: 'Treatment of Materials & Custom Manufacturing',
    summary: 'Treatment of materials, recycling of waste and trash, custom manufacturing, air purification and water treatment.',
    popularGoodsServices: ['Custom 3D printing & CNC machining', 'Metal electroplating & heat treatment', 'Waste recycling & shredding', 'Textile dyeing & stitching', 'Water purification contracts'],
    keywords: ['manufacturing', 'fabrication', 'recycling', 'printing', 'treatment', 'custom', 'machining', 'refining']
  },
  {
    classNumber: 41,
    type: 'Services',
    title: 'Education, Training, Entertainment & Sporting Activities',
    summary: 'Education, providing of training, entertainment, sporting and cultural activities, publishing of books and media.',
    popularGoodsServices: ['EdTech online learning platforms', 'K-12 schools, colleges & coaching centers', 'Film production & music concerts', 'Gyms, sports coaching & tournaments', 'Event management & stage shows'],
    keywords: ['education', 'training', 'school', 'coaching', 'edtech', 'entertainment', 'film', 'music', 'event', 'sports academy', 'gym']
  },
  {
    classNumber: 42,
    type: 'Services',
    title: 'IT, Software Development, Cloud & Scientific Research',
    summary: 'Scientific and technological services, research and design relating thereto, industrial analysis, IT development, SaaS cloud.',
    popularGoodsServices: ['Custom web & mobile app development', 'SaaS cloud hosting & cybersecurity', 'AI algorithm design & data science', 'Architectural & interior design services', 'Clinical trial scientific testing'],
    keywords: ['it', 'software', 'technology', 'saas', 'cloud', 'developer', 'cybersecurity', 'ai', 'data science', 'web development', 'architecture', 'engineering']
  },
  {
    classNumber: 43,
    type: 'Services',
    title: 'Restaurants, Cafés, Cloud Kitchens & Hotel Hospitality',
    summary: 'Services for providing food and drink, temporary accommodation, hotel reservations, catering.',
    popularGoodsServices: ['Fine dine restaurants & cafés', 'Cloud kitchens & food delivery outlets', 'Luxury hotels, resorts & homestays', 'Event & wedding catering services', 'Hostels & PG accommodations'],
    keywords: ['restaurant', 'cafe', 'food', 'cloud kitchen', 'hotel', 'hospitality', 'resort', 'catering', 'homestay', 'bar']
  },
  {
    classNumber: 44,
    type: 'Services',
    title: 'Healthcare, Hospitals, Beauty Salons & Agriculture Services',
    summary: 'Medical services, veterinary services, hygienic and beauty care for human beings or animals, agriculture, horticulture.',
    popularGoodsServices: ['Multispecialty hospitals & clinics', 'Diagnostic pathology labs', 'Hair salons & luxury spas', 'Veterinary pet hospitals', 'Drone agricultural spraying'],
    keywords: ['medical', 'healthcare', 'hospital', 'doctor', 'clinic', 'salon', 'spa', 'beauty parlour', 'ayurvedic clinic', 'veterinary', 'agriculture']
  },
  {
    classNumber: 45,
    type: 'Services',
    title: 'Legal, Security, Matrimonial & Social Services',
    summary: 'Legal services, security services for the physical protection of tangible property and individuals, personal and social services.',
    popularGoodsServices: ['Corporate legal advocacy & litigation', 'Company secretarial & compliance filing', 'Manned security guard agencies', 'Matrimonial matchmaking portals', 'Private investigation services'],
    keywords: ['legal', 'lawyer', 'advocate', 'compliance', 'security', 'guard', 'investigation', 'matrimonial', 'patent attorney']
  }
];
