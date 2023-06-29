import { albumsRouter } from "~/server/api/routers/albums";
import { listingsRouter } from "./routers/listings";
import { collectionRouter } from "./routers/collections";
import { sellersRouter } from "./routers/sellers";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  albums: albumsRouter,
  listings: listingsRouter,
  collections: collectionRouter,
  sellers: sellersRouter
});

export type AppRouter = typeof appRouter;
