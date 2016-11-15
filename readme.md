#tCouchDBBuilderCLI

Handling designdocuments in couchdb is aweful, even with the new UI included to couchDB 2.0.
So I was looking for other solutions. As a Javascript expert I liked the progress that is made,
with couchdb-compiler and couchdb-builder. Both modules read a directory and prepare a single
design that can be written to couchDB.

This CLI-tool and module will provide the following features:
   1. read multiple designdocuments from the fileSystem
   2. update the documents in couchdb that are readed from the fileSystem
   3. provide a document called "general" to extend others, usefull to provide libraries of usefull cmd-modules.
   5. read existing documents from couchDB and store them to the fileSystem.

