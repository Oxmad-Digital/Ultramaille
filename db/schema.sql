-- Schéma PostgreSQL (Neon) d'Ultramaille, issu des modèles Mongoose de src/models/.
-- Ré-exécutable : aucune instruction DROP, tout est en IF NOT EXISTS / OR REPLACE.
-- gen_random_uuid() est natif depuis PostgreSQL 13 : aucune extension requise.

-- Met à jour updated_at à chaque UPDATE (équivalent des timestamps Mongoose).
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  slug            text NOT NULL UNIQUE,
  legacy_mongo_id text UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- authors
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL UNIQUE,
  slug             text NOT NULL UNIQUE,
  email            text NOT NULL DEFAULT '',
  bio              text NOT NULL DEFAULT '',
  avatar_url       text,
  avatar_public_id text,
  legacy_mongo_id  text UNIQUE,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER authors_set_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- admins
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text NOT NULL UNIQUE,
  password_hash      text NOT NULL,
  role               text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'member')),
  reset_token_hash   text,
  reset_token_expiry timestamptz,
  invite_pending     boolean NOT NULL DEFAULT false,
  legacy_mongo_id    text UNIQUE,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER admins_set_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url             text NOT NULL,
  public_id       text NOT NULL UNIQUE,
  filename        text NOT NULL DEFAULT '',
  alt             text NOT NULL DEFAULT '',
  format          text NOT NULL DEFAULT '',
  bytes           integer NOT NULL DEFAULT 0,
  width           integer NOT NULL DEFAULT 0,
  height          integer NOT NULL DEFAULT 0,
  legacy_mongo_id text UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_created_at_idx ON media (created_at DESC);

CREATE OR REPLACE TRIGGER media_set_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS articles (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text NOT NULL UNIQUE,
  title_fr              text NOT NULL DEFAULT '',
  title_en              text NOT NULL DEFAULT '',
  excerpt_fr            text NOT NULL DEFAULT '',
  excerpt_en            text NOT NULL DEFAULT '',
  content_fr            text NOT NULL DEFAULT '',
  content_en            text NOT NULL DEFAULT '',
  meta_title_fr         text NOT NULL DEFAULT '',
  meta_title_en         text NOT NULL DEFAULT '',
  meta_description_fr   text NOT NULL DEFAULT '',
  meta_description_en   text NOT NULL DEFAULT '',
  cover_image_url       text,
  cover_image_public_id text,
  cover_image_alt       text NOT NULL DEFAULT '',
  author_id             uuid REFERENCES authors (id) ON DELETE SET NULL,
  -- Nom de la catégorie (pas de clé étrangère, comme dans Mongo).
  category              text NOT NULL DEFAULT '',
  tags                  text[] NOT NULL DEFAULT '{}',
  status                text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  featured              boolean NOT NULL DEFAULT false,
  favorite              boolean NOT NULL DEFAULT false,
  published_at          timestamptz,
  views                 integer NOT NULL DEFAULT 0,
  -- {"fr": n, "en": n}, NULL tant que non calculé.
  reading_minutes       jsonb,
  legacy_mongo_id       text UNIQUE,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_status_published_at_idx ON articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON articles (author_id);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);

CREATE OR REPLACE TRIGGER articles_set_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- page_views (pas d'updated_at, comme dans Mongo)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_views (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day             text NOT NULL,            -- 'YYYY-MM-DD' (UTC)
  path            text NOT NULL,
  referrer        text NOT NULL DEFAULT '',
  device_type     text NOT NULL DEFAULT 'desktop',
  country         text NOT NULL DEFAULT '',
  duration        double precision,         -- ms, NULL tant que non reçu
  visitor_hash    text NOT NULL,
  legacy_mongo_id text UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_day_idx ON page_views (day);
CREATE INDEX IF NOT EXISTS page_views_day_path_idx ON page_views (day, path);

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key                 text NOT NULL UNIQUE DEFAULT 'site',
  maintenance_mode    boolean NOT NULL DEFAULT false,
  maintenance_message text NOT NULL DEFAULT '',
  legacy_mongo_id     text UNIQUE,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER settings_set_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- rate_limits (non migrée ; les lignes expirées sont ignorées puis écrasées)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rate_limits (
  key        text PRIMARY KEY,
  count      integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS rate_limits_expires_at_idx ON rate_limits (expires_at);
