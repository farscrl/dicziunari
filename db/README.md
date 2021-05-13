# Data generation

This folder contains the scripts needed, to build the db for the dicziunari App.

It starts from an export of www.pledarigrond.ch and transforms it into a SQLite Database.

## Generate db

1. Place the export into the data folder
2. Run `npm run convert`
3. Copy the result into the dicziunari project

## DB structure

We create two tables in the database: The one (`rumgr`) contains all the data, including conjugations. The other one (`rumgr_idx`) is a virtual [FTS5](https://www.sqlite.org/fts5.html) table used for fast search and lookup.
