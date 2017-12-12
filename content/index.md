---
url: /
name: Derek Worthen
title: MicroTypes
subtitle: Let's break down the monoliths of content negotiation
linkName: Overview
isIndex: true
index: 1
---

The current mechanism of content negotiation through Media Types in HTTP draws
difficulties on evolving APIs without breaking existing clients.
API designer needs to define in a sole place many concerns, often competing each other:
semantics for the API responses and client’s requests,
semantics for HATEOAS, semantics for API capabilities,
semantics for evolving (adding/removing/altering) these capabilities and many more.
The result is a very complex specification for any modern Media Type.

What is worse however is that, unless an API designer creates her own Media Type (which should be avoided in general),
Media Types are like black boxes: by trying to specify everything in an API response (and possible request),
they do not allow us to adapt them to our own needs. We have to either take it or leave it.

If Software Engineering has learned us something,
is that composition can enforce Single Responsibility Principle, if used correctly.
Media Types should be broken in smaller components, each describing very carefully
a specific functionality of a modern API.
The concept of MicroTypes is exactly that: small, reusable, even confugrable, modules that compose a Media Type.

Microtypes in combination with reactive negotiation, a forgotten but still valid
negotiation mechanism in HTTP, can give us enormous possibilities when designing
a new API by allowing the API designers to tailor the API capabilities to their
needs while at the same time it enables clients to negotiate parts of the API
functionality that are only interested or understand and not the Media Type as
a whole.

Choosing between REST or GraphQL won’t be necessary as APIs can support both
styles progressively, simultaneously, or asymmetrically for different classes
of clients, using multiple sets of MicroTypes.



