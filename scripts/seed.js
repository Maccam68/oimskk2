import { query } from '../src/lib/db.js';
import { hash } from '../src/lib/auth.js';

const seedData = async () => {
  try {
    // Seed admin user
    const adminPin = await hash('13121');
    await query(
      `INSERT INTO users (username, pin, role, name, email) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING`,
      ['Maccam68', adminPin, 'admin', 'Master Admin', 'admin@example.com']
    );

    // Seed Ofsted sections
    const sections = [
      {
        title: 'Quality of Education',
        description: 'Standards related to educational quality',
        actions: ['Review curriculum', 'Assess teaching methods', 'Monitor student progress']
      },
      {
        title: 'Behaviour and Attitudes',
        description: 'Standards for behavior management and student attitudes',
        actions: ['Review behavior policy', 'Monitor attendance', 'Assess student engagement']
      }
    ];

    for (const section of sections) {
      await query(
        `INSERT INTO ofsted_sections (title, description, actions)
         VALUES ($1, $2, $3)
         ON CONFLICT (title) DO NOTHING`,
        [section.title, section.description, section.actions]
      );
    }

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();