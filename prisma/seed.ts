import {PrismaClient} from "@prisma/client";
import {add} from "date-fns";
const prisma = new PrismaClient();

const weekFromNow = add(new Date(), {days: 7});
const twoWeeksFromNow = add(new Date(), {days: 14});
const monthFromNow = add(new Date(), {days: 28});

async function main() {
  const grace = await prisma.user.create({
    data: {
      email: "grace@hey.com",
      firstName: "Grace",
      lastName: "Bell",
      social: {
        facebook: "gracebell",
        twitter: "therealgracebell",
      },
    },
  });

  const course = await prisma.course.create({
    data: {
      name: "CRUD with Prisma",
      tests: {
        create: [
          {
            date: weekFromNow,
            name: "First test",
          },
          {
            date: twoWeeksFromNow,
            name: "Second test",
          },
          {
            date: monthFromNow,
            name: "Final exam",
          },
        ],
      },
      members: {
        create: {
          role: "TEACHER",
          user: {
            connect: {
              email: grace.email,
            },
          },
        },
      },
    },
    include: {
      tests: true,
    },
  });

  const shakuntala = await prisma.user.create({
    data: {
      email: "devi@prisma.io",
      firstName: "Shakuntala",
      lastName: "Devi",
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: {id: course.id},
          },
        },
      },
    },
  });

  const david = await prisma.user.create({
    data: {
      email: "david@prisma.io",
      firstName: "David",
      lastName: "Deutsch",
      courses: {
        create: {
          role: "STUDENT",
          course: {
            connect: {id: course.id},
          },
        },
      },
    },
  });

  const testResultDavid = [650, 900, 950];
  const testResultsShakuntala = [800, 950, 910];

  let counter = 0;
  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: {email: grace.email},
        },
        student: {
          connect: {email: shakuntala.email},
        },
        test: {
          connect: {id: test.id},
        },
        result: testResultsShakuntala[counter],
      },
    });

    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: {email: grace.email},
        },
        student: {
          connect: {email: david.email},
        },
        test: {
          connect: {id: test.id},
        },
        result: testResultDavid[counter],
      },
    });

    counter++;
  }

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
