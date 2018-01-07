---
url: why
name: Derek Worthen
title: MicroTypes
subtitle: The building blocks of our Internet
linkName: Why ?
index: 2
---

### A common problem
Hasn't happened to you that when building an API based on a well-known Media Type you suddendly find out that
it would have been better if you could introduce a small change ?
For instance, imagine that you build an API based on JSON:API spec, however you really want to have tempalted
URIs on links.

Unfortunately you can't do anything about it, more or less. You will have to either break the Media Type that your
API announces that it uses (the JSON:API) or create a completely new Media Type.

The first option is out of the question because like that you would break one of the REST's constraints: self-descriptive messages.
By breaking the Media Type that the client accepts, the client won't understand your content leading to undefined behavior.

The only viable option is the second one, however creating a whole new Media Type just for that doesn't make much sense.
Creating a new Media Type is a lengthy, not easy, process and should generally be avoided.

### MicroTypes to the rescue
What if you could keep your Media Type as is, however, define a small MicroType that would define the semantics of the links
on your API.
The MicroType could be either specific for JSON:API spec, or even more general one, which would benefit other API designers as
well, however it would require substantially more thoughtness and rigorouness.

For instance, you could publish your basic API as JSON:API with non-templated links but provide the ability for "smarter"
clients to ask the more usefull API semantics, that include URI templates in the links.
How you can do that? As we define in FOOBAR, you can do that currently using Media Type parameters.
Imagine that your newly created MicroType is named `json-api-templated-links`, which define pretty well the new
semantics of your API, essentially the templated links used instead of the plain ones, in JSON:API.

A client can negotiate for the conventional JSON:API Media Type as usual:

```http
Accept: application/vnd.api+json;
```

However, the smarter client can append the MicroTypes it wants as Media Type parameters:
```http
Accept: application/vnd.api+json; linking=json-api-templated-links;
```

By seeing `linking=json-api-templated-links` the API understands that the client wants it to enable the templated URIs
MicroType in the responses. The Media Type's parameter (`linking`) and value (`json-api-templated-links`) would have to
be defined in the MicroType specification itself.

Since the API supports that MicroType, it can respond with that modified Media Type and also announce it to the client:
```http
Accept: application/vnd.api+json; linking=json-api-templated-links;
```

### Why not just a new Media Type
Why not defining a new Media Type, just as how our Internet architecture currently works ?

Well, although that's technically correct, it leads to many side-effects and problems down the line.
One of the the biggest obstacles of such solution is the fact that defining a whole new Media Type is quite tough.
Moreover, in theory, when you override a Media Type spec, you need to publish your changes as a complete custom Media Type
for humans to go through it and program their client accordingly. Once the client is programmed, the same implementation
can be reused for many different APIs, that follow this new custom Media Type.

Creating a complete new Media Type, even extending semantically an existing one is quite difficult. If you can do that
then that's great. Unfortunately very few people (in the world!) can do that.
As a result, what happens in practice is that we 

Instead, defining the new semantic extensions has much less limited scope and is easier.

### Reusability is the key
By deriving common extensions to well known Media Types, we will end up with reusable MicroTypes that
different API designers can use and combine together.
Reusability is a key in MicroTypes concept, something that, unfortunately, is missing from [The 'profile' Link Relation Type](https://tools.ietf.org/html/rfc6906).

### Asymmetric evolution of your API
What if you want to evolve your API, one (semantic) feature at a time.

### Discovery and negotiation!
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


The benefits when leveraging such architecture are multi-fold.


Secondly, the MicroTypes specs and possibly implementations can be re-used by both the servers and clients.
Instead of defining a whole Media Type, API designers will be able to include various small modules
that extend the API functionality they way it's needed.
We firmly believe that once the community defines a number of MicroTypes, it will be much easier for an API designer
to design a new API by reusing the MicroTypes she thinks fit best to her needs.

+profiles
