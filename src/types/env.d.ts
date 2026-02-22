declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
    }
  }
  
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export {};