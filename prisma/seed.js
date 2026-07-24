const prisma = require("../src/db");

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// Deterministic placeholder images (picsum.photos/seed/... always returns the
// same image for the same seed string, so re-running this seed doesn't churn
// URLs on every run).
function placeholderImages(name, count) {
  return Array.from({ length: count }, (_, i) => {
    const seed = `${slugify(name)}-${i}`;
    return `https://picsum.photos/seed/${seed}/800/800`;
  });
}

async function main() {
  // Sample user data
  // await prisma.user.createMany({
  //     data: [
  //         {
  //             first_name: "Alice",
  //             last_name: "Okello",
  //             email: "alice@example.com",
  //             password: "hashedpassword123",
  //             isAdmin: false,
  //         },
  //         {
  //             first_name: "Brian",
  //             last_name: "Mugerwa",
  //             email: "brian@example.com",
  //             password: "hashedpassword456",
  //             isAdmin: false,
  //         },
  //         {
  //             first_name: "Carol",
  //             last_name: "Nakamya",
  //             email: "carol@example.com",
  //             password: "hashedpassword789",
  //             isAdmin: true,
  //         },
  //         {
  //             first_name: "David",
  //             last_name: "Kintu",
  //             email: "david@example.com",
  //             password: "hashedpassword101",
  //             isAdmin: false,
  //         },
  //         {
  //             first_name: "Evelyn",
  //             last_name: "Namara",
  //             email: "evelyn@example.com",
  //             password: "hashedpassword202",
  //             isAdmin: true,
  //         }
  //     ],
  // });
  console.log("✔️ Sample users added.");

  // Sample Categories
  await prisma.category.createMany({
    data: [
      { name: "Electronics" },
      { name: "Cosmetics" },
      { name: "Food & Beverage" },
    ],
  });
  console.log("✔️ Sample categories added.");

  // Sample Products data — names/descriptions now match their category
  // (categoryId 1 = Electronics, 2 = Cosmetics, 3 = Food & Beverage)
  const products = [
    // Electronics
    {
      name: "Wireless Noise-Cancelling Headphones",
      price: 312.49,
      categoryId: 1,
      description:
        "Over-ear headphones with active noise cancellation and 30-hour battery life.",
      featured: true,
      imageCount: 3,
    },
    {
      name: "Smart Fitness Watch",
      price: 120.75,
      categoryId: 1,
      description:
        "Tracks heart rate, sleep, and workouts, with a week-long battery.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Portable Bluetooth Speaker",
      price: 257.99,
      categoryId: 1,
      description:
        "Compact waterproof speaker with rich bass and 12-hour playtime.",
      imageCount: 1,
    },
    {
      name: "27-inch 4K Monitor",
      price: 432.15,
      categoryId: 1,
      description:
        "Ultra-HD display with HDR support, ideal for design and gaming.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Mechanical Gaming Keyboard",
      price: 210.0,
      categoryId: 1,
      description: "RGB backlit keyboard with hot-swappable switches.",
      featured: true,
      imageCount: 3,
    },
    {
      name: "Ergonomic Wireless Mouse",
      price: 76.32,
      categoryId: 1,
      description:
        "Contoured mouse designed for all-day comfort and precision.",
      imageCount: 1,
    },
    {
      name: "20,000mAh Portable Charger",
      price: 88.99,
      categoryId: 1,
      description: "Fast-charging power bank with dual USB-C ports.",
      imageCount: 1,
    },
    {
      name: "HD Webcam with Ring Light",
      price: 312.3,
      categoryId: 1,
      description:
        "1080p webcam with built-in lighting for calls and streaming.",
      imageCount: 2,
    },
    {
      name: "Aluminum Laptop Stand",
      price: 260.1,
      categoryId: 1,
      description: "Adjustable stand that improves posture and laptop airflow.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Smart Home Hub",
      price: 141.25,
      categoryId: 1,
      description:
        "Central hub for controlling lights, locks, and smart plugs.",
      imageCount: 1,
    },
    {
      name: "Wireless Charging Pad",
      price: 389.9,
      categoryId: 1,
      description:
        "15W fast wireless charger compatible with most phone cases.",
      imageCount: 1,
    },
    {
      name: "4K Action Camera",
      price: 99.99,
      categoryId: 1,
      description: "Rugged, waterproof camera with image stabilization.",
      featured: true,
      imageCount: 2,
    },

    // Cosmetics
    {
      name: "Matte Liquid Lipstick",
      price: 298.65,
      categoryId: 2,
      description:
        "Long-wearing, transfer-proof matte lipstick in a rich pigment.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Hydrating Vitamin C Serum",
      price: 399.99,
      categoryId: 2,
      description:
        "Brightening facial serum with vitamin C and hyaluronic acid.",
      imageCount: 1,
    },
    {
      name: "12-Shade Eyeshadow Palette",
      price: 123.45,
      categoryId: 2,
      description: "Blendable matte and shimmer shades for everyday looks.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Charcoal Detox Face Mask",
      price: 343.2,
      categoryId: 2,
      description: "Deep-cleansing clay mask that draws out impurities.",
      featured: true,
      imageCount: 3,
    },

    // Food & Beverage
    {
      name: "Single-Origin Coffee Beans",
      price: 279.75,
      categoryId: 3,
      description:
        "Freshly roasted arabica beans with notes of chocolate and citrus.",
      imageCount: 2,
    },
    {
      name: "Herbal Tea Sampler Pack",
      price: 320.5,
      categoryId: 3,
      description: "A curated selection of six caffeine-free herbal teas.",
      featured: true,
      imageCount: 2,
    },
    {
      name: "Raw Wildflower Honey",
      price: 490.0,
      categoryId: 3,
      description:
        "Unfiltered, cold-extracted honey from local wildflower fields.",
      imageCount: 1,
    },
    {
      name: "Dark Chocolate Sampler",
      price: 135.6,
      categoryId: 3,
      description: "Assorted single-origin dark chocolate bars, 70%-85% cacao.",
      imageCount: 1,
    },
  ];

  for (const { imageCount, ...productData } of products) {
    const imageUrls = placeholderImages(productData.name, imageCount);

    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            key: `seed/${slugify(productData.name)}-${index}`, // placeholder - no real S3 object behind seeded images
            position: index,
            isPrimary: index === 0,
          })),
        },
      },
    });
  }
  console.log("✔️ Sample products added (with images).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
