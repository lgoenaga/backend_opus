import path from "path";

type DatabaseClient = "mysql" | "postgres" | "sqlite";

interface DatabaseConfig {
	connection: {
		client: string;
		acquireConnectionTimeout: number;
		[key: string]: any;
	};
}

export default ({ env }: { env: any }): DatabaseConfig => {
	const client = env("DATABASE_CLIENT", "mysql") as DatabaseClient;

	const connections = {
		mysql: {
			connection: {
				host: env("DATABASE_HOST", "localhost"),
				port: env.int("DATABASE_PORT", 3306),
				database: env("DATABASE_NAME"),
				user: env("DATABASE_USERNAME"),
				password: env("DATABASE_PASSWORD"),
				ssl: env.bool("DATABASE_SSL", false)
					? {
							key: env("DATABASE_SSL_KEY", undefined),
							cert: env("DATABASE_SSL_CERT", undefined),
							ca: env("DATABASE_SSL_CA", undefined),
							capath: env("DATABASE_SSL_CAPATH", undefined),
							cipher: env("DATABASE_SSL_CIPHER", undefined),
							rejectUnauthorized: env.bool(
								"DATABASE_SSL_REJECT_UNAUTHORIZED",
								true
							),
						}
					: false,
			},
			pool: {
				min: env.int("DATABASE_POOL_MIN", 2),
				max: env.int("DATABASE_POOL_MAX", 10),
			},
		},
		postgres: {
			connection: {
				connectionString: env("DATABASE_URL"),
				host: env("DATABASE_HOST", "localhost"),
				port: env.int("DATABASE_PORT", 5432),
				database: env("DATABASE_NAME", "strapi"),
				user: env("DATABASE_USERNAME", "strapi"),
				password: env("DATABASE_PASSWORD", "strapi"),
				ssl: env.bool("DATABASE_SSL", false)
					? {
							key: env("DATABASE_SSL_KEY", undefined),
							cert: env("DATABASE_SSL_CERT", undefined),
							ca: env("DATABASE_SSL_CA", undefined),
							capath: env("DATABASE_SSL_CAPATH", undefined),
							cipher: env("DATABASE_SSL_CIPHER", undefined),
							rejectUnauthorized: env.bool(
								"DATABASE_SSL_REJECT_UNAUTHORIZED",
								true
							),
						}
					: false,
				schema: env("DATABASE_SCHEMA", "public"),
			},
			pool: {
				min: env.int("DATABASE_POOL_MIN", 2),
				max: env.int("DATABASE_POOL_MAX", 10),
			},
		},
		sqlite: {
			connection: {
				filename: path.join(
					__dirname,
					"..",
					"..",
					env("DATABASE_FILENAME", ".tmp/data.db")
				),
			},
			useNullAsDefault: true,
		},
	};

	// Validar que el cliente existe
	if (!connections[client]) {
		throw new Error(`Unsupported database client: ${client}`);
	}

	return {
		connection: {
			client,
			...connections[client],
			acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
		},
	};
};
