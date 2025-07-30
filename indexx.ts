import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { title } from "process";

const prisma = new PrismaClient();

async function main() {
    
//     const hashedPassword = await bcrypt.hash('bob123', 10)
//    const user = await prisma.user.create({
//        data: {
//             name:'bob',
//            email: 'bob@gmail.com',
//            password: hashedPassword
//        },
//    })
// //    get all users
   const users= await prisma.user.findMany({
    include: {
        article: true,
    }
   });
// const token = jwt.sign(
//     { id: user.id, email: user.email },
//     process.env.JWT_SECRET!, // Load from .env file
//     { expiresIn: "1h" }
//   );
//   console.log("✅ User created:", user);
//   console.log("🔐 JWT Token:", token);
     
     console.log(users);
    // const article = await prisma.article.create({
    //     data: {
    //         titel: 'nathnael first article',
    //         body: 'this is nathnaels first article',
    //         author: {
    //             connect: {
    //                 id: 1
    //             }
    //         }
    //     }
    // })
    // // get all articles
    // const articles = await prisma.article.findMany();
    //   console.log(article);
    
// create user and article and associate them
//     const hashedPassword = await bcrypt.hash('qwert', 10)
// const user = await prisma.user.create({
//     data: {
//         name: ' tamerat desta',
//         email: 'tamerat@gmail.com',
//         password: hashedPassword,
//         article: {
//             create: {
//                 titel: 'tamerat first article',
//                 body: 'this is tamerates first article'
//             }
//         }
//     }
// });
// console.log(user);
//create anotehr article to tamerat
//  const article = await prisma.article.create({
//     data: {
//         titel: 'tamerat second article',
//         body: 'this is tamerats second article',
//         author: {
//             connect: {
//                id : 3,
//             }
//         }

//     }
//  })
// console.log(article);
// loop over saras articles
// users.forEach((user) => {
//     console.log(`User: ${user.name}, email: ${user.email}`);
//     console.log(`Article:`);
//     user.article.forEach((article) =>{
//         console.log(`- Titel: ${article.titel}, Body:${article.body}`)
//     })
//     console.log('\n');
// })
// update data
//  const user = await prisma.user.update({
//     where: {
//         id: 1
//     },
//     data: {
//         name: 'malon big G'
    
//     }

//  })
//  console.log(user);
// }
// remove article
// const article = await prisma.article.delete({
//     where: {
//         id: 2
//     }
// })
// console.log(articles);
}

main ()
.then(async () =>{
    await prisma.$disconnect();

})
 .catch(async (e) =>{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);

});