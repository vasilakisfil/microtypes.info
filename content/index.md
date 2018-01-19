---
url: /
title: MicroTypes
subtitle: Let's break down the monoliths of content negotiation
linkName: Overview
index: 1
excludeNav: true
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
is that **composition** can enforce Single Responsibility Principle, if used correctly.
Media Types should be broken in smaller components, each describing very carefully
a specific functionality of a modern API.

The concept of MicroTypes is exactly that: **small**, **isolated**, **reusable**, even **confugrable**,
**modules** that are **negotiable** and **discoverable** which compose a Media Type and facilitate the evolvability of our API.
