# Data generation

This folder contains the scripts needed, to build the db for the dicziunari App.

It starts from an export of www.pledarigrond.ch and the other publishers and transforms it into a SQLite Database.

## Generate db

1. The scripts expects an empty db in the `db/build` directory. You can rename the file `db/build/dicziunariSQLite_sample.db` to `dicziunariSQLite.db` to have an empty db file.
1. Place the export into the data folder and name them like the example data, but without the `_short` suffix
1. Run `npm run convert`
1. Copy the result into the databases folder of the `app` project (`app/src/assets/databases`)

## DB structure

We create a table in the database for each language.

# Memory

The HTML parser needs a lot of memory to run. If the node process is out of memory, it throws an error like this: `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`. The memory can be incresed with this command:

- `export NODE_OPTIONS="--max-old-space-size=8192"` (export NODE_OPTIONS="--max-old-space-size=(X \* 1024)" #increase to Xgb)


# Troubleshooting
- `libtool: unrecognized option -static when building`: Libtool had a breaking change from version 2.4.2 to 2.4.6. Make sure, you have version 2.4.2 in your $PATH. See: https://github.com/nodejs/node/issues/2341 
