---
url: available-microtypes
title: MicroTypes
subtitle: Reusable, configurable,  well-defined, MicroType
linkName: Available MicroTypes
index: 5
---

**We are on special need for general purpose push/update MicroTypes for any (API-related) Media Type.**

At the moment we are working on a `querying over url` MicroType inspired by
[`active_hash_relation`](https://github.com/kollegorna/active_hash_relation) library and a pagination
MicroType with configurability capabilities.

If you have done any related work in your API, from linked data down to the wire level,
please consider wrapping it in a small MicroType and publish it so other can use it.
Just ping us here so we can add a link :)


Examples of MicroTypes could be semantics for:
* generic link component, why have different semantics for linking on each Media Type ?
* pagination
* querying over url (applying filters, aggregations, pagination/sorting on a resource),
* resource/association inclusion in the same response
* semantic/linked data
* hypermedia actions (required fields, available fields),
* data types and resource schemas
* error information
* and more advanced, like HTTP/2 server push for specific resources/states etc

Each one of these could be defined as separate MicroTypes that specify in isolation how that part of the API works.
The parent Media Type doesn't need to know in advance all the MicroTypes that the API designer intends to use
because that would mean that adding new MicroTypes would require a new parent Media Type which consequently means breaking the clients.
Instead, each MicroType should be attachable to a parent Media Type that defines new behavior and clients
would take into account only MicroTypes that negotiated for and are programmed to understand.
