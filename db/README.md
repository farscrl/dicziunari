# Data generation

This folder contains the scripts needed, to build the db for the dicziunari App.

It starts from an export of www.pledarigrond.ch and transforms it into a SQLite Database.

## Generate db

1. Place the export into the data folder
2. Run `npm run convert`
3. Copy the result into the dicziunari project

## DB structure

We create two tables in the database: The one (`rumgr`) contains all the data, including conjugations.

There is code commented out to create a table (`rumgr_idx`). This is a virtual [FTS5](https://www.sqlite.org/fts5.html) table that could be used for fast text search and lookup.

# Memory

The HTML parser needs a lot of memory to run. If the node process is out of memory, it throws an error like this: `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`. The memory can be incresed with this command:

- `export NODE_OPTIONS="--max-old-space-size=8192"` (export NODE_OPTIONS="--max-old-space-size=(X \* 1024)" #increase to Xgb)
