import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const listingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const listings = await ctx.prisma.listing.findMany();
      return listings;
    } catch (e) {
      console.log(e);
    }
  }),

  createListing: privateProcedure
    .input(
      z.object({
        price: z.number(),
        currency: z.string(),
        weight: z.string(),
        format: z.string(),
        description: z.string(),
        condition: z.string(),
        speed: z.string(),
        albumId: z.string(),
        edition: z.array(z.object({ value: z.string() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const editionArray = input.edition.map<{id: number}>((form) => ({id: Number(form.value)}))
      const stripeId = ctx.user.privateMetadata.stripeId as string
      try{
        const newProduct = await ctx.stripe.products.create({
          name: input.albumId,
          description: 'Testing testing',
          metadata: {
            'sellerId': stripeId,
          }
        })
        const newPrice = await ctx.stripe.prices.create({
          unit_amount: input.price * 100,
          currency: input.currency.toLowerCase(),
          product: newProduct.id
        })
        const listing = await ctx.prisma.listing.create({
          data: {
            price: input.price,
            currency: input.currency,
            weight: input.weight,
            format: input.format,
            description: input.description,
            condition: input.condition,
            speed: input.speed,
            seller: {
              connect: {
                stripeId: stripeId,
              },
            },
            edition: {
              connect: editionArray
            },
            album: {
              connect: {
                id: input.albumId,
              },
            },
          },
        });
      return listing;
      } catch (e) {
        console.log(e);
      }
    }),

  getByAlbumId: publicProcedure
    .input(
      z.object({
        albumId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { albumId } = input;
      try {
        const listings = await ctx.prisma.listing.findMany({
          where: { albumId },
          include: {
            edition: true,
            seller: true,
          },
        });
        return listings;
      } catch (e) {
        console.log(e);
      }
    }),

  getByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const listings = await ctx.prisma.listing.findMany({
          where: {
            stripeId: input,
          },
        });
        return listings;
      } catch (e) {
        console.log(e);
      }
    }),
});

//   createListingStripe: privateProcedure.mutation(async ({ ctx }) => {
//     const stripeId = ctx.user.privateMetadata.stripeId;
//     try {
//       const newProduct = await ctx.stripe.products.create({
//         name: "Thriller",
//         description: "Testing testing",
//         metadata: {
//           sellerId: stripeId as string,
//         },
//       });
//       //TODO Add new product to db
//       const newPrice = await ctx.stripe.prices.create({
//         unit_amount: 2000,
//         currency: "gbp",
//         product: newProduct.id,
//       });
//       return { newProduct, newPrice };
//     } catch (e) {
//       console.log(e);
//     }
//   }),
// });

// create: privateProcedure
//   .input(
//     z.object({
//       price: z.number(),
//       currency: z.string(),
//       weight: z.string(),
//       format: z.string(),
//       description: z.string(),
//       condition: z.string(),
//       edition: z.string(),
//     })
//   )
//   .mutation(async ({ ctx, input }) => {
//     const userId = ctx.user.id;
//     const albumId = "cljfsjjhp0001uaecu3329kku";
//     try {
//       const listing = await ctx.prisma.listing.create({
//         data: {
//           price: input.price,
//           currency: input.currency,
//           weight: input.weight,
//           format: input.format,
//           description: input.description,
//           condition: input.condition,
//           special: input.edition,
//           user: {
//             connect: {
//               id: userId,
//             },
//           },
//           album: {
//             connect: {
//               id: albumId,
//             },
//           },
//         },
//       });
//       return listing;

//     } catch (e) {
//       console.log(e);
//     }
//   }),
