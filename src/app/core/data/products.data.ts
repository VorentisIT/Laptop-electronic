import { Product } from '../models/product.model';

// Helper to generate the 40 frame paths
export const APEX_HERO_FRAMES: string[] = Array.from({ length: 40 }, (_, i) => {
  const frameNum = String(i + 1).padStart(3, '0');
  return `images/frames/ezgif-frame-${frameNum}.jpg`;
});

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'vorentis-apex-18',
    slug: 'vorentis-apex-18-neo',
    name: 'Vorentis Apex 18 Neo',
    modelCode: 'VRX-9800-OLED',
    brand: 'Vorentis Labs',
    tagline: 'Hyper-Silicon Architecture. Zero Thermal Bottlenecks.',
    shortDescription: 'The definitive 18-inch flagship laptop with 4K Tandem Mini-LED, dual vapor-chamber cooling, and unlocked desktop-class silicon.',
    description: 'Forged from monolithic aerospace grade magnesium-titanium alloy, the Vorentis Apex 18 Neo redefines mobile computing. Equipped with a custom 24-core neural processor, liquid metal thermal interface, and 240Hz 4K Tandem display, it delivers sustained desktop workstation performance without acoustic compromise.',
    category: 'laptops',
    segment: ['gaming', 'creative', 'developer'],
    price: 3899,
    originalPrice: 4299,
    rating: 4.96,
    reviewCount: 312,
    isNew: true,
    isFeatured: true,
    isFlagship: true,
    stockStatus: 'in_stock',
    badge: 'FLAGSHIP 2026',
    heroImage: 'images/hero/apex-closed.jpg',
    galleryImages: [
      'images/hero/apex-closed.jpg',
      'images/hero/apex-open.jpg',
      'images/hero/apex-teardown.jpg',
      'images/frames/ezgif-frame-001.jpg',
      'images/frames/ezgif-frame-020.jpg',
      'images/frames/ezgif-frame-040.jpg'
    ],
    explodedViewAvailable: true,
    frameSequencePath: 'images/frames/',
    explodedLayers: [
      {
        id: 'layer-display',
        name: '4K Tandem Mini-LED Panel',
        description: '2,500 nits peak brightness with 100% DCI-P3 color gamut, Delta-E < 0.8 calibration and 240Hz variable refresh.',
        material: 'Gorilla Armor Glass + Quantum Dot Matrix',
        role: 'Visual Output & Calibrated Color Studio',
        depthZ: 140,
        yOffset: 90,
        highlightColor: '#00f2ff',
        techSpec: '3840 x 2400 · 240Hz · 2500 nits · 0.2ms'
      },
      {
        id: 'layer-keyboard',
        name: 'Per-Key Haptic Mech Matrix',
        description: 'Low-profile optical switches with 1.2mm actuation and zero ghosting RGB backlight.',
        material: 'PBT Double-shot Keycaps & Stainless Stabilizers',
        role: 'Precision Tactile Input',
        depthZ: 95,
        yOffset: 40,
        highlightColor: '#3b82f6',
        techSpec: 'Optical 45g actuation · 0.1ms debounce'
      },
      {
        id: 'layer-chassis-top',
        name: 'Titanium-Magnesium Unibody Top',
        description: 'CNC machined unibody shell with integrated acoustic waveguides and thermal venting channels.',
        material: 'Grade 5 Aerospace Titanium Alloy',
        role: 'Structural Rigidity & Passive Dissipation',
        depthZ: 60,
        yOffset: 20,
        highlightColor: '#94a3b8',
        techSpec: '1.2mm wall thickness · 380% rigidity vs aluminum'
      },
      {
        id: 'layer-motherboard',
        name: '12-Layer Micro-Via PCB',
        description: 'High-density interconnect PCB with dedicated neural accelerator and 16-phase digital VRM.',
        material: 'TG-170 Low-Loss Dielectric & 2oz Copper Traces',
        role: 'Central Processing & Power Distribution',
        depthZ: 10,
        yOffset: -10,
        highlightColor: '#10b981',
        techSpec: '24 Cores / 32 Threads · 5.8 GHz Turbo'
      },
      {
        id: 'layer-cooling',
        name: 'Dual Cryo-Vapor Phase Chamber',
        description: '3D curved vacuum vapor chamber filled with deionized liquid and sintering copper wick capillaries.',
        material: 'Pure Deoxygenated Electrolytic Copper',
        role: '250W Sustained Thermal Dissipation',
        depthZ: -35,
        yOffset: -30,
        highlightColor: '#00f2ff',
        techSpec: '250W sustained TDP · Liquid Metal TIM'
      },
      {
        id: 'layer-battery',
        name: '99.9Wh Solid-State Battery Block',
        description: 'Silicon-carbon composite cell matrix with ultra-fast 140W gallium nitride PD charging.',
        material: 'High-Energy-Density Si-C Anode Cells',
        role: 'Uninterrupted All-Day Power Reserve',
        depthZ: -75,
        yOffset: -50,
        highlightColor: '#f59e0b',
        techSpec: '99.9Wh FAA Maximum · 0-80% in 34 mins'
      },
      {
        id: 'layer-chassis-bottom',
        name: 'Graphene-Coated Base Shell',
        description: 'Bottom intake cowl with integrated anti-dust magnetic filtration and composite thermal shielding.',
        material: 'Graphene Composite + Rubber Isolators',
        role: 'Acoustic Insulation & Intake Aerodynamics',
        depthZ: -110,
        yOffset: -70,
        highlightColor: '#64748b',
        techSpec: 'Direct Air Induction · <28 dBA Whisper Mode'
      }
    ],
    colors: [
      { name: 'Obsidian Void', hex: '#0B0F19', finish: 'Matte' },
      { name: 'Cyber Titanium', hex: '#64748B', finish: 'Titanium' },
      { name: 'Nebula Silver', hex: '#CBD5E1', finish: 'Anodized' }
    ],
    specs: {
      processor: 'Vorentis Hyperion X9 24-Core (5.8 GHz)',
      graphics: 'NVIDIA RTX 5090 Mobile 24GB GDDR7 (175W + 25W Boost)',
      memory: '64GB Dual-Channel DDR5-6400 MT/s CAMM2',
      storage: '4TB PCIe Gen 5 NVMe SSD (14,000 MB/s Read)',
      display: '18.0" 16:10 4K Tandem Mini-LED (3840x2400), 240Hz, HDR2000',
      displayNits: 2500,
      refreshRate: 240,
      battery: '99.9Wh High-Density Solid-State',
      batteryLifeHours: 11.5,
      weight: '2.45 kg (5.40 lbs)',
      cooling: 'Dual 3D Vapor Chamber + Liquid Metal TIM',
      ports: ['2x Thunderbolt 5 / USB4 80Gbps', '2x USB-A 3.2 Gen2', '1x HDMI 2.1 FRL', '1x 2.5G RJ-45 Ethernet', '1x SD Express 8.0 Slot', '3.5mm Hi-Fi Combo DAC'],
      dimensions: '398 x 286 x 19.8 mm',
      os: 'Vorentis OS / Windows 11 Pro Pre-installed',
      warranty: '3 Years Global On-Site + VIP Tech Concierge'
    },
    benchmarks: {
      geekbenchMultiCore: 22850,
      cinebenchR24: 2680,
      timespyGpuScore: 24500,
      batteryLifeHours: 11.5,
      thermalTdpWatts: 275,
      renderEfficiencyScore: 98
    },
    highlights: [
      'Desktop-grade RTX 5090 24GB VRAM mobile powerhouse',
      'First-ever 18-inch 4K 240Hz Tandem Mini-LED screen',
      'Dual 3D Vapor Chamber handles up to 275W combined TDP',
      'Thunderbolt 5 dual ports with 80 Gbps bi-directional throughput'
    ],
    inTheBox: [
      'Vorentis Apex 18 Neo Workstation',
      '330W GaN Slim Compact Power Supply',
      'Braided 240W Type-C Silicon Cable',
      'Microfiber Armor Cleaning Cloth',
      'Custom CNC Metal Authenticity Card'
    ]
  },
  {
    id: 'vorentis-blade-carbon',
    slug: 'vorentis-blade-carbon-oled',
    name: 'Vorentis Blade Carbon 16',
    modelCode: 'VBC-16-OLED',
    brand: 'Vorentis Labs',
    tagline: 'Ultralight 1.4kg Carbon Monolith with 3.2K 165Hz Tandem OLED.',
    shortDescription: 'The ultimate portable creative machine engineered for uncompromising architects, developers, and filmmakers.',
    description: 'Constructed from aerospace chopped carbon fiber and forged magnesium, the Blade Carbon 16 weighs just 1.48 kg while packing an incredible 16-core processor and dedicated RTX 5070 GPU.',
    category: 'laptops',
    segment: ['creative', 'developer', 'business'],
    price: 2799,
    originalPrice: 2999,
    rating: 4.92,
    reviewCount: 184,
    isNew: true,
    isFeatured: true,
    stockStatus: 'in_stock',
    badge: 'CREATIVE CHOICE',
    heroImage: 'images/frames/ezgif-frame-010.jpg',
    galleryImages: [
      'images/frames/ezgif-frame-010.jpg',
      'images/frames/ezgif-frame-018.jpg',
      'images/frames/ezgif-frame-028.jpg'
    ],
    explodedViewAvailable: true,
    colors: [
      { name: 'Carbon Stealth', hex: '#111827', finish: 'Matte' },
      { name: 'Lunar Quartz', hex: '#E2E8F0', finish: 'Anodized' }
    ],
    specs: {
      processor: 'Vorentis Hyperion X7 16-Core (5.2 GHz)',
      graphics: 'NVIDIA RTX 5070 Mobile 12GB GDDR7',
      memory: '32GB LPDDR5X-7500 MT/s Quad-Channel',
      storage: '2TB PCIe Gen 4 NVMe (7,400 MB/s)',
      display: '16.0" 3.2K Tandem OLED (3200x2000), 165Hz, Calman Verified',
      displayNits: 1600,
      refreshRate: 165,
      battery: '88Wh High-Capacity Lithium-Polymer',
      batteryLifeHours: 14.2,
      weight: '1.48 kg (3.26 lbs)',
      cooling: 'Ultra-thin 0.1mm Copper Vapor Core',
      ports: ['2x Thunderbolt 4', '1x USB-C 3.2', '1x USB-A', '1x HDMI 2.1', 'Full-size SD Card 4.0'],
      dimensions: '354 x 242 x 14.2 mm',
      os: 'Windows 11 Pro',
      warranty: '2 Years Premium International Support'
    },
    benchmarks: {
      geekbenchMultiCore: 18400,
      cinebenchR24: 1980,
      timespyGpuScore: 16200,
      batteryLifeHours: 14.2,
      thermalTdpWatts: 140,
      renderEfficiencyScore: 94
    },
    highlights: [
      'Unbelievably slim 14.2mm profile weighing only 1.48kg',
      '100% Adobe RGB and DCI-P3 color calibrated Tandem OLED',
      '14+ hours of real-world battery endurance',
      'Whisper-quiet acoustic chamber design under 32 dBA'
    ],
    inTheBox: [
      'Vorentis Blade Carbon 16',
      '140W GaN USB-C Travel Charger',
      'Braided 2m USB-C Cable',
      'Protective Felt Armor Sleeve'
    ]
  },
  {
    id: 'vorentis-monolith-x',
    slug: 'vorentis-monolith-x-workstation',
    name: 'Vorentis Monolith X Desktop',
    modelCode: 'VMX-STATION-PRO',
    brand: 'Vorentis Labs',
    tagline: 'Architectural Compute Station. 64 Cores. Liquid Immersion Cooling.',
    shortDescription: 'Industrial-grade neural computing workstation crafted from solid architectural billet aluminum with custom closed-loop cooling.',
    description: 'Designed for AI researchers, 8K VFX production studios, and simulations. Monolith X houses up to two RTX 5090 GPUs in an isolated acoustic acoustic silo.',
    category: 'workstations',
    segment: ['developer', 'creative'],
    price: 6499,
    originalPrice: 6999,
    rating: 4.98,
    reviewCount: 76,
    isNew: true,
    isFeatured: true,
    stockStatus: 'in_stock',
    badge: 'AI NEURAL RIG',
    heroImage: 'images/frames/ezgif-frame-035.jpg',
    galleryImages: [
      'images/frames/ezgif-frame-035.jpg',
      'images/frames/ezgif-frame-022.jpg'
    ],
    explodedViewAvailable: true,
    colors: [
      { name: 'Dark Gunmetal', hex: '#1E293B', finish: 'Anodized' },
      { name: 'Raw Billet Aluminum', hex: '#94A3B8', finish: 'Cyber' }
    ],
    specs: {
      processor: 'AMD Threadripper Pro 7985WX 64-Core (5.1 GHz Turbo)',
      graphics: 'Dual NVIDIA RTX 5090 32GB GDDR7 (Total 64GB VRAM)',
      memory: '256GB Octa-Channel ECC DDR5-5600',
      storage: '8TB Gen 5 RAID 0 Array (28,000 MB/s)',
      display: 'Supports up to 8x 8K 120Hz Displays',
      displayNits: 0,
      refreshRate: 0,
      battery: '1600W Titanium Certified Modular PSU',
      batteryLifeHours: 0,
      weight: '19.2 kg (42.3 lbs)',
      cooling: 'Triple 420mm Copper Radiator Custom Loop',
      ports: ['4x USB4 / Thunderbolt 4', '8x USB-A 3.2 Gen2', '2x 10GbE Aquanria LAN', 'Optical S/PDIF', 'WiFi 7 Tri-Band'],
      dimensions: '520 x 240 x 510 mm',
      os: 'Ubuntu LTS / Windows 11 Workstation',
      warranty: '5 Years 24/7 Dedicated Enterprise SLA'
    },
    benchmarks: {
      geekbenchMultiCore: 38900,
      cinebenchR24: 5120,
      timespyGpuScore: 48000,
      batteryLifeHours: 0,
      thermalTdpWatts: 950,
      renderEfficiencyScore: 99
    },
    highlights: [
      'Dual RTX 5090 with 64GB high-speed memory for local LLM inference',
      '64-Core Threadripper with 256GB quad-rank ECC RAM',
      'Whisper-quiet triple 420mm custom liquid loop',
      'Hot-swappable enterprise NVMe sleds on front panel'
    ],
    inTheBox: [
      'Vorentis Monolith X Desktop Station',
      'Modular 1600W Braided Cable Kit',
      'External High-Gain Wi-Fi 7 Antenna Array',
      'Toolless Drive Trays & Security Keys'
    ]
  },
  {
    id: 'vorentis-vision-32',
    slug: 'vorentis-vision-32-oled',
    name: 'Vorentis Vision 32 Quantum',
    modelCode: 'VVS-32-OLED',
    brand: 'Vorentis Labs',
    tagline: '32-inch 4K 240Hz QD-OLED Reference Monitor.',
    shortDescription: 'The pinnacle of visual fidelity. 0.03ms pixel response time, true 10-bit color, 99.5% Adobe RGB, and 140W USB-C PD hub.',
    description: 'Engineered for color grading suites, competitive esports, and cinematic entertainment. Vision 32 features a custom heatsink with 0dB passive silent operation and graphene layer protection against burn-in.',
    category: 'displays',
    segment: ['creative', 'gaming', 'developer'],
    price: 1499,
    originalPrice: 1699,
    rating: 4.89,
    reviewCount: 142,
    isNew: true,
    isFeatured: false,
    stockStatus: 'in_stock',
    badge: '4K 240HZ QD-OLED',
    heroImage: 'images/frames/ezgif-frame-020.jpg',
    galleryImages: [
      'images/frames/ezgif-frame-020.jpg',
      'images/frames/ezgif-frame-005.jpg'
    ],
    explodedViewAvailable: false,
    colors: [
      { name: 'Space Gray', hex: '#334155', finish: 'Anodized' }
    ],
    specs: {
      processor: 'Dual Quantum Neural Image Engine',
      graphics: 'G-Sync Ultimate & FreeSync Premium Pro',
      memory: 'Integrated KVM Switch with 4 Host Presets',
      storage: 'Custom Color Profile Calibration Flash',
      display: '31.5" 4K QD-OLED (3840x2160), 240Hz, 0.03ms GtG',
      displayNits: 1400,
      refreshRate: 240,
      battery: 'Integrated 140W PD Internal Power Hub',
      batteryLifeHours: 0,
      weight: '6.8 kg (with stand)',
      cooling: 'Custom Graphene Thermal Backplane (0dB Fanless)',
      ports: ['2x DisplayPort 2.1 UHBR20', '2x HDMI 2.1 48Gbps', '1x USB-C 140W PD + DP Alt', '3x USB-A 3.2 Hub', '3.5mm DAC Out'],
      dimensions: '714 x 480-600 x 220 mm (Adjustable Stand)',
      os: 'On-Screen HUD with Hardware Colorimeter Suite',
      warranty: '3 Years Zero Burn-In Guarantee'
    },
    benchmarks: {
      geekbenchMultiCore: 0,
      cinebenchR24: 0,
      timespyGpuScore: 0,
      batteryLifeHours: 0,
      thermalTdpWatts: 65,
      renderEfficiencyScore: 97
    },
    highlights: [
      '4K 240Hz 3rd Gen QD-OLED panel with 0.03ms response',
      'Full 140W single-cable USB-C laptop power and video',
      'True 10-bit native color with delta-E under 0.5',
      '3-Year full burn-in protection warranty included'
    ],
    inTheBox: [
      'Vorentis Vision 32 Monitor',
      'Die-cast Aluminum Counterbalance Stand',
      'DisplayPort 2.1 Cable (2m)',
      'HDMI 2.1 High Speed Braided Cable',
      'Factory Color Calibration Report'
    ]
  },
  {
    id: 'vorentis-rtx-5090-liquid',
    slug: 'vorentis-rtx-5090-liquid-core',
    name: 'Vorentis RTX 5090 Liquid Core',
    modelCode: 'VGPU-5090-LC',
    brand: 'Vorentis Labs',
    tagline: '32GB GDDR7. Integrated 360mm AIO. Zero Sag Billet Bracket.',
    shortDescription: 'The fastest consumer graphics card ever conceived. Integrated closed-loop liquid cooling keeps the GPU under 48°C under continuous 600W load.',
    description: 'Engineered for extreme enthusiasts. The full copper micro-fin cold plate covers GPU die, VRM, and VRAM chips directly for unparalleled sustained boost frequencies over 3.1 GHz.',
    category: 'components',
    segment: ['gaming', 'creative', 'developer'],
    price: 2199,
    rating: 4.97,
    reviewCount: 98,
    isNew: true,
    isFeatured: true,
    stockStatus: 'low_stock',
    badge: 'UNLOCKED 600W',
    heroImage: 'images/frames/ezgif-frame-025.jpg',
    galleryImages: [
      'images/frames/ezgif-frame-025.jpg',
      'images/frames/ezgif-frame-015.jpg'
    ],
    explodedViewAvailable: true,
    colors: [
      { name: 'Titanium Obsidian', hex: '#0F172A', finish: 'Cyber' }
    ],
    specs: {
      processor: '24,576 CUDA Cores / 192 SMs (3.15 GHz Boost)',
      graphics: '32GB GDDR7 on 512-bit bus (1,792 GB/s Bandwidth)',
      memory: '32GB GDDR7',
      storage: 'PCIe 5.0 x16 Interface',
      display: 'Supports up to 4x 8K 120Hz displays',
      displayNits: 0,
      refreshRate: 0,
      battery: '12V-2x6 Power Connector (600W capable)',
      batteryLifeHours: 0,
      weight: '2.1 kg (GPU + 360mm Radiator)',
      cooling: 'Asetek 8th Gen Pump + 360mm High-Static Radiator',
      ports: ['3x DisplayPort 2.1', '1x HDMI 2.1a'],
      dimensions: '280 x 140 x 42 mm (2-slot card profile)',
      os: 'Vorentis GPU Master Suite / GeForce Drivers',
      warranty: '4 Years Replacement Warranty'
    },
    benchmarks: {
      geekbenchMultiCore: 0,
      cinebenchR24: 0,
      timespyGpuScore: 41200,
      batteryLifeHours: 0,
      thermalTdpWatts: 600,
      renderEfficiencyScore: 99
    },
    highlights: [
      'Massive 32GB GDDR7 video memory with 1.8 TB/s bandwidth',
      'Sleek 2-slot thickness with whisper-quiet 360mm radiator',
      'Sub-50°C load temps under sustained 600W rendering',
      'CNC milled structural backplate with liquid flow indicators'
    ],
    inTheBox: [
      'Vorentis RTX 5090 Liquid Core GPU',
      'Pre-attached 360mm Liquid Radiator with 3x Mag-Lev Fans',
      '12V-2x6 Braided Cable Adapter',
      'Custom Anti-Sag Aluminum Support Pillar'
    ]
  },
  {
    id: 'vorentis-stealth-mech',
    slug: 'vorentis-stealth-mech-80',
    name: 'Vorentis Haptic Mech-80',
    modelCode: 'VKB-80-HAPTIC',
    brand: 'Vorentis Labs',
    tagline: '8000Hz Polling. Magnetic Hall-Effect Switches. Solid Brass Weight.',
    shortDescription: 'Precision 80% custom mechanical keyboard with adjustable rapid-trigger magnetic switches, CNC aluminum chassis, and sound-dampened acoustic gaskets.',
    description: 'Designed for pure tactile satisfaction and split-millisecond esports reaction times. Actuation depth can be adjusted per-key from 0.1mm to 4.0mm in 0.05mm increments.',
    category: 'accessories',
    segment: ['gaming', 'developer', 'creative'],
    price: 249,
    originalPrice: 289,
    rating: 4.88,
    reviewCount: 260,
    isNew: false,
    isFeatured: false,
    stockStatus: 'in_stock',
    badge: '8000HZ RAPID TRIGGER',
    heroImage: 'images/frames/ezgif-frame-012.jpg',
    galleryImages: [
      'images/frames/ezgif-frame-012.jpg'
    ],
    explodedViewAvailable: false,
    colors: [
      { name: 'Void Black', hex: '#0B0F19', finish: 'Matte' },
      { name: 'Cyber Silver', hex: '#94A3B8', finish: 'Anodized' }
    ],
    specs: {
      processor: 'Dual 32-bit ARM Cortex-M4 Microcontroller',
      graphics: 'South-facing per-key RGB + Underglow Diffusion',
      memory: '8MB On-board memory for 16 profiles & macros',
      storage: 'Detachable Braided USB-C to USB-A cable',
      display: '0.96" OLED HUD for live APM and actuation readouts',
      displayNits: 500,
      refreshRate: 60,
      battery: '4000mAh Battery (up to 200 hours wireless)',
      batteryLifeHours: 200,
      weight: '1.85 kg (Brass internal weight)',
      cooling: 'PORON & IXPE 5-layer acoustic dampening',
      ports: ['USB-C', '2.4GHz Low-latency Wireless', 'Bluetooth 5.3'],
      dimensions: '358 x 136 x 38 mm',
      os: 'Vorentis Key Engine (WebHID / Windows / macOS / Linux)',
      warranty: '2 Years Worldwide Warranty'
    },
    benchmarks: {
      geekbenchMultiCore: 0,
      cinebenchR24: 0,
      timespyGpuScore: 0,
      batteryLifeHours: 200,
      thermalTdpWatts: 5,
      renderEfficiencyScore: 92
    },
    highlights: [
      'Ultra-responsive 0.1mm rapid trigger magnetic switches',
      'Full 8,000Hz polling rate for true 0.125ms latency',
      'Solid brass acoustic weight delivers deep thock sound profile',
      'Tri-mode connectivity with 200-hour wireless battery reserve'
    ],
    inTheBox: [
      'Vorentis Haptic Mech-80 Keyboard',
      '2.4GHz HyperSpeed USB Dongle',
      'Braided Gold-plated USB-C Cable',
      '2-in-1 Keycap and Switch Puller',
      '4x Extra Magnetic Switches'
    ]
  }
];
