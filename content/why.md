---
url: why
title: MicroTypes
subtitle: The building blocks of our Internet
linkName: Why ?
index: 2
---

## From Media Types to MicroTypes
_Note: some contents of this page were first published in [blog.kollegorna.se](https://blog.kollegorna.se)_

Has it ever happened to you that, when building an API based on a well-known
Media Type, you suddenly realize that it would have been better if you could
introduce a small change ? For instance, imagine that you build an API based on
[JSON:API](http://jsonapi.org) spec, but you really want to have templated URIs
on links.

Unfortunately you can’t do much about it. Your available options are:

* **breaking the Media Type**: the last thing you want because you would break one
of the REST’s constraints: self-descriptive messages. By breaking the Media Type
that the client accepts, the client won’t understand your content, leading to
undefined behavior.
* **creating a new Media Type**: not a very easy option because creating a new
Media Type is a lengthy, rigorous  process and should generally be avoided. But
it doesn’t make much sense either: creating a whole new Media Type just for a
tiny change?
* **creating a profile using the** [RFC6906](https://www.ietf.org/rfc/rfc6906.txt): saying that our API follows more
specific constraints than our announced Media Type seems quite helpful. But is
this really what we want to solve here?

Let’s go over each of these options in detail.

#### Breaking our announced Media Type

One of the main REST constraints is that **representations are exchanged via
self-descriptive messages***. *This means that the data of the response should
follow the Media Type that the client requested and understands. Given that the
client negotiated for that Media Type, it should be able to parse and understand
any part of the response.

> Interaction is stateless between requests, standard methods and Media Types are
> used to indicate semantics and exchange information, and responses explicitly
> indicate cacheability.
>
> Roy Fielding

If our Media Type is weak for our needs (in terms of semantic capabilities) and
we require functionality that the Media Type does not describe, or we just want
to alter some semantics of our Media Type (like adding URI templates in
JSON:API), then we need to define another Media Type which will describe the new
semantics and wait until client(s) incorporate the new Media Type changes.

Breaking our Media Type’s semantics, or just extending them with new
functionality, will have exactly the same result for the client: not
self-descriptive messages that will require out-of-band information, like
documentation, or will lead to undefined behavior. In any case, the result is
quite counter productive for the machines and obviously that’s the worst option
we could choose, yet it’s a popular one :/

#### Defining and publishing a new Media Type

Why not define a new Media Type, just as how our Internet architecture currently
works ?

Well, although that’s technically correct, it leads to many side-effects and
problems down the line. One of the the biggest obstacles of such solution is the
fact that defining a whole new Media Type is quite tough. Moreover, in theory,
when you override a Media Type spec, you need to publish your changes as a
complete custom Media Type for *humans* to go through it and program their
client accordingly. Of course, once the client is programmed, the same
implementation can be reused for many different APIs that follow this new custom
Media Type.

Creating a complete new Media Type, or even semantically extending an existing
one is difficult. If you can do that then that’s great! Probably you are a rock
star as well. Unfortunately very few people can do that (hey, that’s why we have
the whole [RFC](https://en.wikipedia.org/wiki/Request_for_Comments) process!).
As a result, what happens in practice is that we just push unpublished (to the
machines) changes on our API and then we hand off out-of-band information to the
client, like documentation, and demand *humans* to check them before parsing and
using the hypermedia semantics of our API.

So while this option is the way to go, it’s tough and experience has shown that
it’s rarely done, in practice we end up with option 1 through a different path
:/

#### The ‘profile’ Link Relation Type

[Erik Wilde](http://dret.net/netdret/) suggested a profiling mechanism of the
underlying Media Type through the [HTTP Link
header](https://tools.ietf.org/html/rfc5988), that was later published as [RFC
6906](https://tools.ietf.org/html/rfc6906).

> A profile is defined not to alter the semantics of the resource representation
> itself, but to allow clients to learn about additional semantics (constraints,
> conventions, extensions) that are associated with the resource representation,
> in addition to those defined by the media type and possibly other mechanisms.
>
> [RFC 6906](https://www.ietf.org/rfc/rfc6906.txt)

Essentially, the profile parameter, given that the client understands it, would
define **additional, more specific** semantics of the response’s representation
that are not defined through the Media Type used. The information for the
additional semantics would be found in all responses regardless the client but
only the “smarter” clients would be able to parse, understand and use this
information whereas the rest would just ignore it.

Unfortunately the RFC fails to advocate towards reusable profiles:

> While this specification associates profiles with resource representations,
> creators and users of profiles MAY define and manage them in a way that allows
> them to be used across media types; thus, they could be associated with a
> resource, independent of their representations (i.e., using the same profile URI
> for different media types). However, such a design is outside of the scope of
> this specification, and clients SHOULD treat profiles as being associated with a
> resource representation.
>
> [RFC 6906](https://www.ietf.org/rfc/rfc6906.txt)

By having profiles attached to specific Media Types this results in much less
adoptability and flexibility and fails to signal the actual practicability of
such architecture. Another issue is the fact that the negotiation part is
skipped from the RFC, something that probably is a requirement if we want to
target evolvable, sustainable, self-described APIs.

But I think the most important thing about this concept is that **it solves a
different problem**. From my personal talks with Erik, he is not very fond of
altering the core semantics of the Media Type but instead add specific ones for
the profile specified:<br> <br>

> (…) what drove the RFC is the ability to identify specific
> extensions/constraints, with the feed/podcast example being a very typical one:
> feed is a widely used media type, but there also is a good ecosystem of just
> podcast/media feeds applications. the feed/profile model works well for making
> sure that one can talk about podcasts, while it always remains clear that a
> podcast is a regular feed. (…) They are simply a signal saying “i am using media
> type X but i am using it with additional constraints”
>
> Erik Wilde

Essentially, a profile should **never** **ever** alter the semantics of the
Media Type used. Instead, it can only add complementary semantics.

Regardless how powerful the Profile link relation is, our initial problem, which
is being able to extend or even override the Media Type’s semantics in a
non-backwards compatible but self-descriptive and evolvable way, is still
unsolved.

### MicroTypes to the rescue
What if you could keep your Media Type as is and compose it with a small module
that would define the semantics of the links on your API? This semantic module
could be either specific for [JSON:API](http://jsonapi.org) spec, or even more
general one, which would benefit other API designers as well, although probably
it would require substantially more thought and rigour.

For instance, you could publish your basic API as JSON:API with non-templated
links but provide the ability for “smarter” clients to ask the more useful API
semantics, that include URI templates in the links. How can you do changes like
this and still have self-descriptive messages in evolvable and sustainable APIs?

Through **small**, **reusable**, **configurable** (per API) modules which are
both **discoverable** and **negotiable**, called MicroTypes.

How you can do that in practice? As we define in <a href="/microtypes-in-http">MicroTypes in HTTP</a> section,
you can do that currently using Media Type parameters.
Imagine that your newly created MicroType is named `json-api-templated-links`, which define pretty well the new
semantics of your API, i.e. using templated links instead of plain ones, in JSON:API.

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

#### Reusability is the key
The MicroTypes specs and possibly implementations can be re-used by both the servers and clients.
Instead of defining a whole Media Type, API designers will be able to include various small modules
that extend the API functionality they way it's needed.
We firmly believe that once the community defines a number of MicroTypes, it will be much easier for an API designer
to design a new API by reusing the MicroTypes she thinks fit best to her needs.
Reusability is a key in MicroTypes concept, something that, unfortunately, is missing from
[The 'profile' Link Relation Type](https://tools.ietf.org/html/rfc6906) RFC.

#### Granularity to the needs of the client
By allowing the client and server to do the regular negotiation flow even for
those sub-media-types, the communication between the 2 ends is parameterized to the
needs of the client, down to the semantics level.
For instance, a server might provide 3 MicroTypes for error information, each one
having different representation or semantics and targeting different class of machines.

#### Negotiation through discovery
_Note: discovery is not a requirement for a MicroType_

In conventional (i.e. preactive) negotiation, the server decides the appropriate MicroType
for the client by analyzing the client's incoming request.
Unfortunately, proactive negotiation is not always as efficient because
the client can only send a part of its properties through
the request, for various reasons like privacy concerns and performance,
and thus the server has **partial knowledge** of the client's state and properties.
The server has to make an arbitrary choice for the client, what it thinks it's
thinks best, using this partial knowledge.

Interestingly, [RFC 7231](https://tools.ietf.org/html/rfc7231) notes that proactive negotiation has
some serious disadvantages:

>   Proactive negotiation has serious disadvantages:
>
>   o  It is impossible for the server to accurately determine what might
>      be "best" for any given user, since that would require complete
>      knowledge of both the capabilities of the user agent and the
>      intended use for the response (e.g., does the user want to view it
>      on screen or print it on paper?);
>
>   o  Having the user agent describe its capabilities in every request
>      can be both very inefficient (given that only a small percentage
>      of responses have multiple representations) and a potential risk
>      to the user's privacy;
>
>   o  It complicates the implementation of an origin server and the
>      algorithms for generating responses to a request; and,
>
>   o  It limits the reusability of responses for shared caching.
>
> --- [RFC 7231](https://tools.ietf.org/html/rfc7231)
>

In fact, from the beginnings of HTTP (since [RFC 2068](https://tools.ietf.org/html/rfc2068#section-12.2), published in 1997),
the protocol allowed another negotiation type: agent-driven or reactive content negotiation negotiation,
that matches very well the MicroTypes concept.
As [RFC 7231](https://tools.ietf.org/html/rfc7231) notes, in reactive content negotiation the server provides a
list of options to the client to choose from.

>  With reactive negotiation (a.k.a., agent-driven negotiation),
>   selection of the best response representation (regardless of the
>   status code) is performed by the user agent after receiving an
>   initial response from the origin server that contains a list of
>   resources for alternative representations.
>
>   (...)
>
>   A server might choose not to send an initial representation, other
>   than the list of alternatives, and thereby indicate that reactive
>   negotiation by the user agent is preferred.  For example, the
>   alternatives listed in responses with the 300 (Multiple Choices) and
>   406 (Not Acceptable) status codes include information about the
>   available representations so that the user or user agent can react by
>   making a selection.
>
> --- [RFC 7231](https://tools.ietf.org/html/rfc7231)
>

With reactive negotiation, the client is responsible for choosing the most appropriate representation,
according to its needs.
By giving the client the option to negotiate parts of the API functionality,
we shift the responsibility towards the client
to select the best representation and semantics of various, isolated, API functionalities.
Given that the client can know much more about its needs than the server, it will
make the best available choice for each API functionality, from the server's options,
which eventually will lead to the optimized combination of MicroTypes.
As we see, in <a href="/microtypes-in-http">MicroTypes in HTTP</a> section, this is called
reactive negotiation, a forgotten but still valid negotiation mechanism.
