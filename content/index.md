---
url: /
name: Derek Worthen
title: MicroTypes
subtitle: Let's break down the monoliths of content negotiation
linkName: Overview
isIndex: true
index: 1
---

Currently, Media Types act as big monoliths that clients need to understand beforehand through human involvement.
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

The benefits when leveraging such architecture are multi-fold.

First, by allowing the client and server to do the regular negotiation flow even for those sub-media-types, the communication
between the 2 ends is parameterized to the needs of the client, down to the semantics level.
For instance, a server might provide 3 MicroTypes for error information, each one having different representation or semantics.
By letting the server to decide the appropriate MicroType for the client by analyzing the client's incoming request,
might not be efficient as the client can only send a part of its properties through the request, for various reasons like privacy concerns and performance,
and thus the server has **partial knowledge** of the client's state and properties.
The server has to make an arbitrary choice for the client, what it thinks it's thinks best, using this partial knowledge.

Instead, by giving the client the option to negotiate parts of the API functionality, we shift the responsibility towards the client
to select the best representation and semantics of various, isolated, API functionalities.
Given that the client can know much more about its needs than the server, it will make the best available choice
for each API functionality, from the server's options, which eventually will lead to the optimized combination of
MicroTypes.
As we will see later, in HTTP protocol, this is called reactive negotiation, a forgotten but still valid negotiation mechanism.

Secondly, the MicroTypes specs and possibly implementations can be re-used by both the servers and clients.
Instead of defining a whole Media Type, API designers will be able to include various small modules
that extend the API functionality they way it's needed.
We firmly believe that once the community defines a number of MicroTypes, it will be much easier for an API designer
to design a new API by reusing the MicroTypes she thinks fit best to her needs.

