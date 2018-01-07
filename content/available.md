---
url: available-microtypes
name: Derek Worthen
title: MicroTypes
subtitle: Reusable, configurable,  well-defined, MicroType
linkName: Available MicroTypes
index: 5
---


Currently, Media Types act as big monoliths that clients need to understand beforehand through human involvement.
Today's APIs are very powerful and being complex require a huge monolith for machines
We believe that Media Types should be broken in smaller
reusable media types, MicroTypes, each describing very carefully a specific functionality of a modern API.
The reasoning is that, in our experience, we have seen that different APIs and API specs define the same functionalities in similar,
but not identical, ways.

Examples of MicroTypes could be semantics for:
* pagination
* querying over url (applying filters, aggregations, pagination/sorting on a resource),
* resource/association inclusion in the same response
* semantic/linked data
* hypermedia actions (required fields, available fields),
* data types and resource schemas
* error information
* and more advanced, like HTTP/2 server push for specific resources/states etc

Each one of these could be defined as separate MicroTypes that specify in isolation how that part of the API works.
At the same time they should be generic enough or follow some specific semantics so that it's possible to be referenced parent
Media Types targeted for Introspected APIs.
The parent Media Type doesn't need to know in advance all the MicroTypes that the API designer intends to use
because that would mean that adding new MicroTypes would require a new parent Media Type which consequently means breaking the clients.
Instead, each MicroType should be attachable to a parent Media Type that defines introspected behavior and clients
would take into account only MicroTypes that are programmed to understand.
