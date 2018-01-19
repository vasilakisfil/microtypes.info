---
url: what-is-a-microtype
title: MicroTypes
subtitle: Small, reusable, configurable Modules for the APIs
linkName: MicroType definition
index: 3
---

A MicroType is defined as a small, isolated, reusable, configurable module.

## Small
The semantics that a MicroType defines should be small in scope.
The MicroType could extend, semantically, an existing Media Type, redefine some parts
of a MicroType, or it could
just specify a common reusable semantically pattern, to be used accross different
types of Media Types.

## Isolated
The semantics of a MicroType should be defined in an isolated way, meaning that
it should not have any dependencies, other than a parent Media Type.
For instance, a MicroType should not require other(s) MicroType(s) for specific
features or conditionally enable semantics in a response based on existing
MicroTypes.

However, requiring existing, published, RFCs is perfectly valid.

## Reusable
One of the main goals of MicroTypes concept is reusability among different APIs.
As a result, a MicroType definition should strive for maximum reusability, thus,
taking into accounts not only specific cases that rise from an existing problem
that was created to solve, but also for other possible cases that could cover
different API designs, as long as those fell in the same scope.

For instance, a MicroType designed for action semantics should not be tight in
a simple Media Type (like JSON:API) but instead the MicroType designer should
aim and provide the available specifications for more broad use.

## Configurable
Although configurability of a MicroType is optional, it's highly recommended to
add support for it.
The reason is that not all API designers think and act the same way and consequently,
being able to configure MicroTypes would maximize the reusability and lead to

### An example: a pagination MicroType
For instance, imagine that we create a MicroType that defines the semantics of
pagination for both request and response. So let's say that we specify that
the client can specify that it can request the page, the size and the offset
using `page`, `per_page`, and `offset` query parameters.
Similarly, we specify that the pagination will appear inside the `meta` object
of the response.

Configurable MicroType would mean that we should be able to configure the MicroType.
For instance, we should be able to specify the query params and be able to rename
them if needed, using linked-data.
Or we should be able to specify the location of the pagination object inside the
response, using [JSON pointer](https://tools.ietf.org/html/rfc6901).

## Module
A MicroType is a module after all, meaning that its specification should define
anything is needed related with its use by the API designers and the API consumers.
For instance, although discovery is not part of the MicroType it self, the spec
should go through the negotiation and discovery methods briefly and specify or
clarify anything that might be needed or be helpful respectively to the MicroType users.

### Discoverable
Ideally a MicroType-based API should also support discoverability of the MicroTypes it
supports, but that's not part of a MicroType definition.
Discoverability is responsibility of the MicroType-powered API through reactive negotiation.

### Negotiable
Each MicroType is negotiable using Media Type parameters, which although rarely used,
are perfectably valid.
Using negotiation, the client can trim the API for its needs down to the semantics level.
Even the same client can request a different combination of MicroTypes based on its
current status at the given time. For instance, if the client has critical hardware issues
or its battery level is at extremeley low levels, it could request hypermedia using
`Link` header to avoid parsing the HTTP body.
