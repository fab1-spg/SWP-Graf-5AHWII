

export type CreateResult = { id: string } & Record<string, any>;

function makeCreate(): (args?: any) => Promise<CreateResult> {
  return async (args?: any) => ({
    id: String(Math.floor(Math.random() * 1e9)),
    ...(args?.data || {}),
  });
}

function makeDeleteMany(): () => Promise<void> {
  return async () => {
    /* no-op for stub */
  };
}

export class PrismaClient {
  song = {
    deleteMany: makeDeleteMany(),
    create: makeCreate(),
  };

  album = {
    deleteMany: makeDeleteMany(),
    create: makeCreate(),
  };

  artist = {
    deleteMany: makeDeleteMany(),
    create: makeCreate(),
  };

  genre = {
    deleteMany: makeDeleteMany(),
    create: makeCreate(),
  };

  async $disconnect(): Promise<void> {
    return;
  }
}

export default PrismaClient;
