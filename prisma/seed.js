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
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "River Truth",
                price: 120.75,
                description: "Every brother note history enjoy statement war region.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Answer Country",
                price: 257.99,
                description: "Structure space movement coach much guess.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Window Begin",
                price: 432.15,
                description: "Front red moment affect action season entire resource.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Mouth Expectation",
                price: 210.00,
                description: "Democratic land walk always scene politics share.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Father Explain",
                price: 76.32,
                description: "Home century industry production improve.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Option Magazine",
                price: 298.65,
                description: "Vote lay finally sign development.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Speech Character",
                price: 399.99,
                description: "Total already answer gas same remain space.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Leg Customer",
                price: 123.45,
                description: "Ground strategy whose high door fire imagine.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Game Account",
                price: 343.20,
                description: "Whose college anything result wide hair clearly.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Region Design",
                price: 88.99,
                description: "Mouth summer evidence night compare.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Sense Office",
                price: 279.75,
                description: "Statement painting popular explain difference.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Energy Clock",
                price: 320.50,
                description: "Simply offer century wonder threat.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Drive Thought",
                price: 490.00,
                description: "Result compare skin fire example.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Culture River",
                price: 135.60,
                description: "Glass serve mission explain.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Doctor Voice",
                price: 312.30,
                description: "Sign peace sport long within visit.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Art Plane",
                price: 260.10,
                description: "Tend future large lead region push.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Measure Growth",
                price: 141.25,
                description: "Reality avoid door stage watch.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Media Success",
                price: 389.90,
                description: "Mean hold clearly couple type.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Garden Machine",
                price: 99.99,
                description: "Remain resource party trade person.",
                createdAt: new Date(),
                updatedAt: new Date()
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
