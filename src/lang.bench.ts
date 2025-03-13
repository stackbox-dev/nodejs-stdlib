import { InvertedIndexMap } from "./lang";

interface TestRecord {
  id: string;
  category: string;
  price: number;
  tags: string[];
  brand: string;
  inStock: boolean;
  rating: number;
}

// Benchmark configuration
const DATASET_SIZES = [1000, 10000, 100000];
const ITERATIONS = 100;

// Test data generators
function generateId(index: number): string {
  return `id-${index.toString().padStart(8, "0")}`;
}

function generateTestRecord(index: number): TestRecord {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Sports"];
  const brands = ["Brand-A", "Brand-B", "Brand-C", "Brand-D", "Brand-E"];
  const tags = ["new", "sale", "premium", "limited", "exclusive"];

  return {
    id: generateId(index),
    category: categories[index % categories.length],
    price: Math.floor(10 + Math.random() * 990),
    tags: [tags[index % tags.length]],
    brand: brands[index % brands.length],
    inStock: Math.random() > 0.2,
    rating: Math.floor(1 + Math.random() * 5),
  };
}

// Benchmark utilities
function measureTime(fn: () => void): number {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  return Number(end - start) / 1_000_000; // Convert to milliseconds
}

async function runBenchmark() {
  console.log("Starting InvertedIndexMap Benchmark\n");

  for (const size of DATASET_SIZES) {
    console.log(`=== Dataset Size: ${size.toLocaleString()} records ===`);

    // Generate test data
    const records = Array.from({ length: size }, (_, i) =>
      generateTestRecord(i),
    );

    // Test different index configurations
    const configs = [
      { name: "Single Index", fields: ["category"] },
      { name: "Multiple Indices", fields: ["category", "brand", "inStock"] },
      {
        name: "All Fields",
        fields: ["category", "brand", "inStock", "rating", "price"],
      },
    ];

    for (const config of configs) {
      console.log(`\nTesting ${config.name}`);

      // Initialize index
      const index = new InvertedIndexMap<TestRecord>(
        (r) => r.id,
        config.fields as (keyof TestRecord)[],
      );

      // Measure insertion time
      const insertionTime = measureTime(() => {
        for (const record of records) {
          index.add(record);
        }
      });
      console.log(`Insertion time: ${insertionTime.toFixed(2)}ms`);

      // Test queries
      const queries = [
        {
          name: "Single field query",
          query: { category: "Electronics" },
        },
        {
          name: "Two field query",
          query: { category: "Electronics", inStock: true },
        },
        {
          name: "Complex query",
          query: { category: "Electronics", inStock: true, brand: "Brand-A" },
        },
      ];

      for (const testQuery of queries) {
        let totalTime = 0;
        let totalResults = 0;

        for (let i = 0; i < ITERATIONS; i++) {
          const queryTime = measureTime(() => {
            const results = index.query(testQuery.query);
            totalResults = results.length;
          });
          totalTime += queryTime;
        }

        const avgTime = totalTime / ITERATIONS;
        console.log(
          `${testQuery.name}: ${avgTime.toFixed(2)}ms avg ` +
            `(${ITERATIONS} iterations, ${totalResults} results)`,
        );
      }
    }
    console.log("\n" + "=".repeat(50) + "\n");
  }
}

// Run benchmark
console.log(
  "Memory usage before:",
  process.memoryUsage().heapUsed / 1024 / 1024,
  "MB",
);
runBenchmark().then(() => {
  console.log(
    "Memory usage after:",
    process.memoryUsage().heapUsed / 1024 / 1024,
    "MB",
  );
  console.log("Benchmark complete");
});
