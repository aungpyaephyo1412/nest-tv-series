import { faker } from '@faker-js/faker';
import { PrismaService } from '../src/database/prisma/prisma.service';
import { RegisterDto } from '../src/features/auth/dto/register.dto';
import { PasswordService } from '../src/util/password.service';
const prisma = new PrismaService();
const passwordService = new PasswordService();
let users: RegisterDto[] = [];
async function main() {
  for (let i: number = 0; i < 100; i++) {
    users = [
      ...users,
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await passwordService.hash('password'),
        address: faker.location.city(),
        dateOfBirth: null,
        gender: null,
      },
    ];
  }
  await prisma.user.createMany({
    data: users,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
