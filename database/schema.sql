-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.process (
  id integer NOT NULL DEFAULT nextval('process_id_seq'::regclass),
  description character varying NOT NULL,
  ute text NOT NULL,
  target integer,
  projects ARRAY DEFAULT '{}'::text[],
  CONSTRAINT process_pkey PRIMARY KEY (id)
);

CREATE TABLE public.production_registry (
  id integer NOT NULL DEFAULT nextval('productionregistry_id_seq'::regclass),
  process_id integer NOT NULL,
  project text NOT NULL,
  interval_in_minutes integer NOT NULL,
  time_tag text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  turn text NOT NULL,
  pieces_quantity integer NOT NULL,
  CONSTRAINT production_registry_pkey PRIMARY KEY (id),
  CONSTRAINT fk_productionregistry_process FOREIGN KEY (process_id) REFERENCES public.process(id)
);

CREATE TABLE public.production_losses (
  id integer NOT NULL DEFAULT nextval('productionlosses_id_seq'::regclass),
  production_registry_id integer NOT NULL,
  cause text NOT NULL,
  classification text NOT NULL,
  description character varying,
  time integer NOT NULL,
  CONSTRAINT production_losses_pkey PRIMARY KEY (id),
  CONSTRAINT fk_productionlosses_productionregistry FOREIGN KEY (production_registry_id) REFERENCES public.production_registry(id)
);

