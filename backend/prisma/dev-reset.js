import { execSync } from 'child_process';

try {
    console.log('Dropping database...');
    execSync('npx prisma db drop --force', { stdio: 'inherit' });

    console.log('Applying migrations...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

    console.log('Seeding database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('✅ Database reset and seeded successfully!');
} catch (error) {
    console.error('Error during DB reset:', error);
    process.exit(1);
}
