---
url: microtypes-in-http
title: MicroTypes in HTTP
subtitle: Applying MicroTypes concept in HTTP
linkName: MicroTypes in HTTP
index: 4
---

MicroTypes concept is not bound to any protocol or spec, however it is expected to mostly
be used in HTTP.
Here we will review how the concept can easily be applied in HTTP protocol.
For instance, we need to solve issues like announcement and negotiation of MicroTypes bound to a Media Type,
priority order in case of overlaps or collisions, identification, and
the actual introspection process to get the MicroType's configuration, in HTTP.

### Revisiting content negotiation in HTTP
As we have already seen, content negotiation in HTTP is achieved through `Accept` request header but it's not the
only header which can be used by the server to determine the appropriate representation for the client.
`Accept-Charset`, `Accept-Encoding`, `Accept-Language` request headers can also be used.
In practice, `User-Agent` header is also used by the server for choosing the right content for the client
because it contains some device and agent characteristics, although it's not part of the standard negotiation headers.
Lately even, a new draft standard is being created, [HTTP Client Hints](http://httpwg.org/http-extensions/client-hints.html),
that extends the HTTP with new request headers which indicate device and agent characteristics.
The server uses all those headers as hints in order to determine the most suitable representation of the content
to be served to the client.

This hint-based mechanism, which according to [RFC 7231](https://tools.ietf.org/html/rfc7231) is called server-driven
or proactive content negotiation, has been extensively used in HTTP protocol.
In the context of MicroTypes and Introspected REST, using this mechanism, the client
can negotiate for [runtime MicroTypes](#102-runtime-microtypes): API functionalities that define semantics
for the data and runtime metadata.
This type of MicroTypes, should tend to appear less often because
if anything can be introspected on the side instead of runtime, it will be
defined as non-runtime, introspective metadata.

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
that matches very well our introspective concept.
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
That goes inline with the MicroTypes concept, as the client, after receiving all the possible server options,
uses the ones that best fit to its use case or understands better.
As the RFC notes, such negotiation has the advantage of choosing the best combination of MicroTypes,
because the client does the selection out of a predefined list that the server publishes.

### 10.2. Runtime MicroTypes
Runtime MicroTypes are targeted for API functionality that is used during the request/response cycle
of plain data.
Such functionality could be pagination, URI  querying language, error descriptions etc or it could even be
semantics around the data itself.
It should also be noted that **even runtime MicroTypes could have content for introspection** but the key difference
from pure introspective MicroTypes is that part of their functionality affects the semantics of the client's request
or server's response.

The negotiation of runtime MicroTypes should follow the regular negotiation flow:
The client should negotiate for the principal Media Type using the `Accept` request
header and the server responds with `Content-Type` response header, denoting the selected representation.
However the key difference is that for each principal Media Type, it should also
negotiate for the MicroTypes to be used with it.
For that, we will employ the Media Type parameters, a rarely used mechanism:

>  Media types MAY elect to use one or more media type parameters, or
>   some parameters may be automatically made available to the media type
>   by virtue of being a subtype of a content type that defines a set of
>   parameters applicable to any of its subtypes.  In either case, the
>   names, values, and meanings of any parameters MUST be fully specified
>   when a media type is registered in the standards tree, and SHOULD be
>   specified as completely as possible when media types are registered
>   in the vendor or personal trees.
>
>   Parameter names have the syntax as media type names and values:
>
>       parameter-name = restricted-name
>
> --- [RFC 6838](https://tools.ietf.org/html/rfc6838)
>

An example of an imaginary Media Type with a couple of parameters for MicroTypes is:

```
Accept: application/vnd.api+json; pagination=simple-spec; querying=graphql;
```

In the aforementioned example, the client asks for representation of `application/vnd.api+json`,
(which as we have seen earlier it vaguely means a vendor application that follows the semantics of `api`, in JSON representation)
but wants the pagination to follow the semantics of `simple-spec` and the querying language of `graphql`.

The client should be able to even set a preference order:

```
Accept: application/vnd.api+json; pagination=simple-spec; querying=graphql; querying=jsonapi;
```
Here the client shows preference to the imaginary `graphql` querying language but if that doesn't exist
then it will accept the `jsonapi` querying language.
It should be noted that this preference is different from a Media Type preference using the relative
weight `q` parameter (also called quality value) as it applies to the MicroType level.
An example with multiple Media Types could be:

```
Accept: application/vnd.api+json; pagination=simple-spec; querying=graphql; querying=jsonapi, application/vnd.api2+json; pagination=simple-spec; querying=jsonapi; querying=jsonapi; q=0.9
```

In this example the client shows preference to the `application/vnd.api+json` Media Type (it has default quality value of 1.0)
with specific preferences on MicroType level, as we explained above.
However if this Media Type is not available then it will accept the next most preferred, `application/vnd.api2+json`, by requesting
specific MicroTypes.

If the server can provide only the less preferred Media Type with the less preferred querying it would answer:
```
Content-Type: application/vnd.api2+json; pagination=simple-spec; querying=graphql
```


### 10.3. Introspective MicroTypes
Introspective MicroTypes don't alter the semantics of request/response cycle but are still valuable to the client
and the decisions they should take based on the current state and the input from the application developer.
They can provide information about the data types, RDF Schema of the resources, etc.
Introspective MicroTypes should employ reactive negotiation.

The question though is **how can the server advertise the availability of MicroTypes for the client
to introspect.**
Ideally we would like to inform the client for all possible options through HTTP instead of employing a serialization format.
Unfortunately, the HTTP protocol doesn't say much about this type of negotiation, only that the status code when requesting
such information should be 300 and `Link` relation header of [RFC 5988](https://tools.ietf.org/html/rfc5988) could be potentially used
to provide the list with all the available options,
mostly for historical reasons that date back to [RFC 2068](https://tools.ietf.org/html/rfc2068#section-12.2):

>  The 300 (Multiple Choices) status code indicates that the target
>   resource has more than one representation, each with its own more
>   specific identifier, and information about the alternatives is being
>   provided so that the user (or user agent) can select a preferred
>   representation by redirecting its request to one or more of those
>   identifiers.  In other words, the server desires that the user agent
>   engage in reactive negotiation to select the most appropriate
>   representation(s) for its needs (Section 3.4). (...)
>
>   For request methods other than HEAD, the server SHOULD generate a
>   payload in the 300 response containing a list of representation
>   metadata and URI reference(s) from which the user or user agent can
>   choose the one most preferred. (...)
>
>   Note: The original proposal for the 300 status code defined the
>   URI header field as providing a list of alternative
>   representations, such that it would be usable for 200, 300, and
>   406 responses and be transferred in responses to the HEAD method.
>   However, lack of deployment and disagreement over syntax led to
>   both URI and Alternates (a subsequent proposal) being dropped from
>   this specification.  It is possible to communicate the list using
>   a set of Link header fields [RFC5988], each with a relationship of
>   "alternate", though deployment is a chicken-and-egg problem.
>
> --- [RFC 7231](https://tools.ietf.org/html/rfc7231)
>

To our knowledge, **reactive negotiation has never been analyzed, used or suggested before**.
Here, apart from `Link` relation header, we also suggest two more alternative implementation to solve
this issue and we will let the community to choose what is the more appropriate solution.


#### 10.4.1 The HTTP OPTIONS method
The server can describe the meta-data of a resource in the response body of the `OPTIONS` request.
In fact, OPTIONS method has historically been used for getting information on methods supported on a specific resource.

According to [RFC 7231](https://tools.ietf.org/html/rfc7231) this method should be used to
determine the capabilities of the server for the targeted resource:

> The OPTIONS method requests information about the communication
> options available for the target resource, at either the origin
> server or an intervening intermediary.  This method allows a client
> to determine the options and/or requirements associated with a
> resource, or the capabilities of a server, without implying a
> resource action.
>
> --- [RFC 7231](https://tools.ietf.org/html/rfc7231)
>

The OPTIONS method could be used for the server to provide a list of available introspective MicroTypes
and let the client choose what it thinks best.


The same RFC mentions that there isn't any practical use of sending an OPTIONS request
to the root url.

> An OPTIONS request with an asterisk ("\*") as the request-target
> (Section 5.3 of [RFC7230]) applies to the server in general rather
> than to a specific resource.  Since a server's communication options
> typically depend on the resource, the "\*" request is only useful as a
> "ping" or "no-op" type of method; it does nothing beyond allowing the
> client to test the capabilities of the server.  For example, this can
> be used to test a proxy for HTTP/1.1 conformance (or lack thereof).
>
> --- [RFC 7231](https://tools.ietf.org/html/rfc7231)
>

However, we feel that this is the perfect case for hosting an API's discovery for available capabilities using
reactive negotiation.
We could keep the `/*` for "ping" or "no-op" type of method as the RFC notes and have the root
`/` for listing all API's capabilities through MicroTypes for all resources, as [IATEOAS](#935-api-bootstraping) denotes.

Now that we know how to fetch the MicroTypes that the server offers, we need to find
an appropriate representation for it.
One option is to employ a common JSON format for describing each MicroType, its URL for introspection along
with the expected Media Type the response in the specified URL uses.
For instance if we would like to introspect resource `/api/users/1` of an API we would get the following
information by sending an `OPTIONS` request to the resource's url.

```json
{
  "JSON-Schema": {
    "url": "/api/users/1?microtype=json-schema",
    "method": "OPTIONS",
    "content-type": "application/schema+json"
  },
  "RDF": {
    "url": "/api/users/1?microtype=rdf",
    "method": "OPTIONS",
    "content-type": "application/rdf+xml"
  },
  "JSON-LD": {
    "url": "api/users/1?microtype=json-ld",
    "method": "OPTIONS",
    "content-type": "application/ld+json"
  }
}
```
The problem though is that such functionality (sending an `OPTIONS` request to `/api/users/1`) must be described
somewhere so that the client knows where to look for it, possibly in the parent Media Type or using another MicroType.
An alternative option is to use the `OPTIONS` request in combination with the `Link` header, as described later, that will announce
the MicroTypes availability. Such functionality should still be described somewhere as
[RFC 7231](https://tools.ietf.org/html/rfc7231) only makes a suggestion for the `Link` header usage.

It is our intention to advice the community to use this solution for the introspection process, without the `Link` header
but with a response body that describes the MicroTypes availability.
The structure and semantics of the response could be available in various serializations and formats and the clients could
specify their preference using the regular, proactive, HTTP negotiation flow of Media Types.
Although, as we will see later, it comes at a cost, we feel that it's the best among all three solutions presented here
and the conceptual notion of OPTIONS method, as described by HTTP specs, matches very well with our intended use case.
Furthermore, such process gives much more flexibility to append any additional information to the client, than
an HTTP header.

#### 10.4.2. Well-known URIs and JSON Home
[RFC 5785](https://tools.ietf.org/html/rfc5785) defines a pre-defined URI for accessing server's various metadata:
> It is increasingly common for Web-based protocols to require the
>   discovery of policy or other information about a host ("site-wide
>   metadata") before making a request.  For example, the Robots
>   Exclusion Protocol <http://www.robotstxt.org/> specifies a way for
>   automated processes to obtain permission to access resources;
>   likewise, the Platform for Privacy Preferences [W3C.REC-P3P-20020416]
>   tells user-agents how to discover privacy policy beforehand. (...)
>
>   When this happens, it is common to designate a "well-known location"
>   for such data, so that it can be easily located.  However, this
>   approach has the drawback of risking collisions, both with other such
>   designated "well-known locations" and with pre-existing resources.
>
>   To address this, this memo defines a path prefix in HTTP(S) URIs for
>   these "well-known locations", "/.well-known/".  Future specifications
>   that need to define a resource for such site-wide metadata can
>   register their use to avoid collisions and minimise impingement upon
>   sites' URI space.
>
> --- [RFC 5785](https://tools.ietf.org/html/rfc5785)
>

Using this specification, the server can register a well-known
URI that is expected to be the first URI the client requests to introspect.
To that extend, a new draft spec is being developed, [JSON Home](https://mnot.github.io/I-D/json-home/)
that defines such document structure that provides all the server resources and capabilities.
Regardless if JSON Home is used, well-known URIs can provide a way to introspect only the
server-wide capabilities:
```
/.well-known/metadata
```

Here, `metadata` would be a new well-known URI registry that either defined in the parent Media Type
or defined by itself as a MicroType.
The spec does not provide a scheme for well-known URIs per resource or nested URI and this means
that we need to build something upon well-known URIs functionality in order to provide
introspection per resource.
How this will be achieved can be defined by the community, if used eventually,
but a possible implementation could be to pass
the desired resource URL as a query in the `metadata` well-known URI registry:
```
/.well-known/metadata?query=/api/users/1
```

Again as with HTTP OPTIONS, the server will either have to provide a representation
of the available MicroTypes inside the response body of the well-known URI or use the `Link` header.

Although this solution could work, we feel that [RFC 5785](https://tools.ietf.org/html/rfc5785)
was not designed to be used for such specific URIs but instead for more generic properties
that usually apply to the host itself.


#### 10.4.3. Link relations through HTTP Link header
Regadless if HTTP OPTIONS or well-known URIs are used, `Link` header, defined in [RFC 5988](https://tools.ietf.org/html/rfc5988),
is an alternative way of publishing the available MicroTypes by the server,
in a representation-agnostic way.

>  A means of indicating the relationships between resources on the Web,
>   as well as indicating the type of those relationships, has been
>   available for some time in HTML [W3C.REC-html401-19991224], and more
>   recently in Atom [RFC4287].  These mechanisms, although conceptually
>   similar, are separately specified.  However, links between resources
>   need not be format specific; it can be useful to have typed links
>   that are independent of their serialisation, especially when a
>   resource has representations in multiple formats.
>
>   To this end, this document defines a framework for typed links that
>   isn't specific to a particular serialisation or application.  It does
>   so by redefining the link relation registry established by Atom to
>   have a broader domain, and adding to it the relations that are
>   defined by HTML.
>
> --- [RFC 5988](https://tools.ietf.org/html/rfc5988)
>

As the [next (draft) version of RFC 5988 notes](https://tools.ietf.org/html/draft-nottingham-rfc5988bis-07):
> a link published through `Link` header can be viewed as a statement of the form
> "link context has a link relation type resource at link target, which has target attributes".
>
> --- [rfc5988bis-07](https://tools.ietf.org/html/draft-nottingham-rfc5988bis-07)
>

As a result, this RFC provides us a representation-agnostic mechanism through which we can
announce link relations of the current visited URL, along with their relation types.
For instance, the following example
```
Link: <http://example.com/TheBook/chapter2>; rel="previous";
     title="previous chapter"
```
would denote that that "chapter2" is previous to this resource in a logical
navigation path.
Note that title is a target attribute or parameter to this link relation.


In the case of Introspected REST, we would use it to announce introspective MicroTypes related
to the resource the client visits.
By exploiting the target attributes we would also like to specify the HTTP method and
optionally the Media Type the client should expect in order to introspect
the given MicroType.

```
Link: <https://www.example.com/api/users/1?microtype=json-schema>; rel="microtype";
     method="options"; type="application/schema+json" name="json-schema",
      <https://www.example.com/api/users/1?microtype=rdf>; rel="microtype";
     method="options"; type="application/schema+json" name="rdf",
      <https://www.example.com/api/users/1?microtype=json-ld>; rel="microtype";
     method="options"; type="application/schema+json" name="json-ld",
```


Also related, Erik Wilde is working on an IETF draft, named [Link Relation Types for Web Services](https://tools.ietf.org/id/draft-wilde-service-link-rel-04.html)
that defines a way to announce metadata of a resource through this mechanism.
Given that and also the fact that this solution has the advantage of solving the MicroTypes announcement
in the HTTP protocol without being tight to a specific serialization, it's easy to think that it's the
most appropriate way to specify the MicroTypes supported on a specific resource.

Unfortunately, this solution has a couple of drawbacks.
First and foremost, the link header size is limited and if other headers of the response
are already overloaded then the server might refuse to render the response to the client
but instead return an HTTP error possibly "413 Request Entity Too Large" or "414 Request-URI Too Long"
although there isn't an HTTP status code explicitly defined for such case.
A possible solution to this could be [Linkset: A Link Relation Type for Link Sets](https://tools.ietf.org/html/draft-wilde-linkset-link-rel-02) RFC proposal
(a work also by Erik Wilde) but currently it's in draft state.
Once published, a Linkset could group together a set of links and provide them to the client by reference.
However Linksets don't actually solve our issue because eventually the MicroTypes announcement would not
be solved in the HTTP level as a **Linkset would have to provide a body format as well**.

Another issue is that the server cannot specify a caching strategy for all links at once because there
is no mechanism in HTTP which allows us to specify caching directives for specific headers only.
As a result, unless we used a Linkset which we can't yet and would cancel any advantages that `Link` header provides
due to the need of a response body,
the client would have to dereference all MicroTypes to figure out their caching properties.

On a side note, over the past few years, we have seen an explosion of link types
used along with `Link` header defined by [RFC 5988](https://tools.ietf.org/html/rfc5988).
The authors of Introspected REST are skeptical with this trend and feel that the `Link` header should
not be overused.
For instance, having more than 5 links in the `Link` header feels that something is wrong, probably too many things
are defined in the protocol level whereas maybe they should be defined somewhere else.
We will let the community to decide if this approach is good for publishing MicroTypes but we would like to stress
the point that **having a link in the HTTP level through `Link` header might be better
for related resources that all clients would understand**, which is not always the case in Introspected REST.
The API designer could add more MicroTypes, progressively, as the time passes and simultaneously,
some clients might not be interested or understand all MicroTypes of an Introspected REST.
Requiring the client to receive all MicroType information for every data request is made
would probably be against the principles of Introspected REST.

