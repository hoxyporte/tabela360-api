import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Kategoriler
  const categories = [
    { name: 'Dişçi', slug: 'disci' },
    { name: 'Psikolog', slug: 'psikolog' },
    { name: 'Avukat', slug: 'avukat' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // İstanbul ve ilçeleri
  const istanbul = await prisma.city.upsert({
    where: { slug: 'istanbul' },
    update: {},
    create: { name: 'İstanbul', slug: 'istanbul' },
  });

  const istanbulDistricts = [
    'Ümraniye', 'Kadıköy', 'Beşiktaş', 'Şişli', 'Maltepe', 'Ataşehir', 'Beykoz', 'Sarıyer', 'Fatih', 'Bakırköy',
  ];

  for (const d of istanbulDistricts) {
    const slug = d.toLowerCase().replace(/\s/g, '-');
    await prisma.district.upsert({
      where: { slug_cityId: { slug, cityId: istanbul.id } },
      update: {},
      create: { name: d, slug, cityId: istanbul.id },
    });
  }

  console.log('Seed tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });