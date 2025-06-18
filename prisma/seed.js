const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Sample user data
    await prisma.user.createMany({
        data: [
            {
                first_name: "Alice",
                last_name: "Okello",
                email: "alice@example.com",
                password: "hashedpassword123",
                isAdmin: false,
            },
            {
                first_name: "Brian",
                last_name: "Mugerwa",
                email: "brian@example.com",
                password: "hashedpassword456",
                isAdmin: false,
            },
            {
                first_name: "Carol",
                last_name: "Nakamya",
                email: "carol@example.com",
                password: "hashedpassword789",
                isAdmin: true,
            },
            {
                first_name: "David",
                last_name: "Kintu",
                email: "david@example.com",
                password: "hashedpassword101",
                isAdmin: false,
            },
            {
                first_name: "Evelyn",
                last_name: "Namara",
                email: "evelyn@example.com",
                password: "hashedpassword202",
                isAdmin: true,
            }
        ],
    });

    console.log('✔️ Sample users added.');
    // Sample Products data
    await prisma.product.createMany({
        data: [
            {
                name: "Vision Meeting",
                price: 312.49,
                description: "Fill cost spring special range air operation play.",
                featured: true
            },
            {
                name: "River Truth",
                price: 120.75,
                description: "Every brother note history enjoy statement war region.",
                featured: true
            },
            {
                name: "Answer Country",
                price: 257.99,
                description: "Structure space movement coach much guess."
            },
            {
                name: "Window Begin",
                price: 432.15,
                description: "Front red moment affect action season entire resource.",
                featured: true
            },
            {
                name: "Mouth Expectation",
                price: 210.00,
                description: "Democratic land walk always scene politics share.",
                featured: true
            },
            {
                name: "Father Explain",
                price: 76.32,
                description: "Home century industry production improve."
            },
            {
                name: "Option Magazine",
                price: 298.65,
                description: "Vote lay finally sign development.",
                featured: true
            },
            {
                name: "Speech Character",
                price: 399.99,
                description: "Total already answer gas same remain space."
            },
            {
                name: "Leg Customer",
                price: 123.45,
                description: "Ground strategy whose high door fire imagine.",
                featured: true
            },
            {
                name: "Game Console",
                price: 343.20,
                description: "Whose college anything result wide hair clearly.",
                featured: true
            },
            {
                name: "Region Design",
                price: 88.99,
                description: "Mouth summer evidence night compare."
            },
            {
                name: "Sense Office",
                price: 279.75,
                description: "Statement painting popular explain difference."
            },
            {
                name: "Energy Clock",
                price: 320.50,
                description: "Simply offer century wonder threat.",
                featured: true
            },
            {
                name: "Drive Thought",
                price: 490.00,
                description: "Result compare skin fire example."
            },
            {
                name: "Culture River",
                price: 135.60,
                description: "Glass serve mission explain."
            },
            {
                name: "Doctor Voice",
                price: 312.30,
                description: "Sign peace sport long within visit."
            },
            {
                name: "Art Plane",
                price: 260.10,
                description: "Tend future large lead region push.",
                featured: true
            },
            {
                name: "Measure Growth",
                price: 141.25,
                description: "Reality avoid door stage watch."
            },
            {
                name: "Media Success",
                price: 389.90,
                description: "Mean hold clearly couple type."
            },
            {
                name: "Garden Machine",
                price: 99.99,
                description: "Remain resource party trade person.",
                featured: true
            }
        ]
    });
    console.log('✔️ Sample products added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
