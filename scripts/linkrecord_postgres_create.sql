--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE TABLE public.record_type (
	"_id" serial NOT NULL,
	"state_name" varchar,
	"company_name" varchar,
	CONSTRAINT "record_types_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE  public.uri (
	"_id" serial NOT NULL,
	"url" varchar NOT NULL,
	"description" varchar NOT NULL,
	CONSTRAINT "uri_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE  public.confidence (
	"_id" serial NOT NULL,
	"upvote" bigint NOT NULL,
	"downvote" bigint NOT NULL,
	CONSTRAINT "confidence_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE  public.link_record (
	"_id" serial NOT NULL,
	"record_type_id" bigint NOT NULL,
	"confidence_id" bigint NOT NULL,
	"uri_id" bigint NOT NULL,
	CONSTRAINT "link_record_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE public.link_record ADD CONSTRAINT "link_record_fk0" FOREIGN KEY ("record_type_id") REFERENCES  public.record_type("_id");
ALTER TABLE public.link_record ADD CONSTRAINT "link_record_fk1" FOREIGN KEY ("confidence_id") REFERENCES  public.confidence("_id");
ALTER TABLE public.link_record ADD CONSTRAINT "link_record_fk2" FOREIGN KEY ("uri_id") REFERENCES  public.uri("_id");

--
-- TOC entry 
-- Dependencies: 
-- Data for Name: record_type; Type: TABLE DATA; Schema:  Owner: -
--
INSERT INTO public.record_type VALUES (1, 'New Jersey', NULL);
INSERT INTO public.record_type VALUES (2, 'New York', NULL);

--
-- TOC entry 
-- Dependencies: 
-- Data for Name: uri; Type: TABLE DATA; Schema:  Owner: -
--
INSERT INTO public.uri VALUES (1, 'https://www.njcourts.gov/self-help/name-change', 'Name change process for the state of New Jersey');
INSERT INTO public.uri VALUES (2, 'https://nycourts.gov/courthelp/namechange/basics.shtml', 'Name change process for the state of New York');


--
-- TOC entry 
-- Dependencies: 
-- Data for Name: confidence; Type: TABLE DATA; Schema:  Owner: -
--
INSERT INTO public.confidence VALUES (1, 100, 20);
INSERT INTO public.confidence VALUES (2, 80, 60);

--
-- TOC entry 
-- Dependencies: 
-- Data for Name: link_record; Type: TABLE DATA; Schema:  Owner: -
--
 INSERT INTO public.link_record VALUES (1, 1, 1, 1);
 INSERT INTO public.link_record VALUES (2, 2, 2, 2);

--
-- PostgreSQL database dump complete
--

