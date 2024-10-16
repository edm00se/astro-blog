---
title: 'Building a Front-End, pt.2'
description: 'an app with AngularJS with our RESTful HTTPServlet'
pubDatetime: 2015-06-17
published: true
series: xpages-servlets
tags: ['xpages', 'domino', 'javascript', 'servlet', 'angularjs']
category: xpages-servlets
permalink: /building-a-front-end-pt2-an-app-with-angular/
redirect_from: /xpages-servlets/building-a-front-end-pt2-an-app-with-angular/
toc: true
---

### Ever Onward

For as much theory and verbiage as yesterday's post was, today's will be primarily code-driven; something I hope you're ready for. I'll run through this all and hopefully I can illustrate succinctly as we go.

### HTML Templating

HTML templating is useful because it frames out the structure of a page, in its components parts, and, possibly the most useful attribute, it can be cached by the browser. This is highly useful for a lot of traffic and saves on the overhead of transporting markup with your data in every update of data. It's one of the topics Marky Roden talked about during his [5 Questions with Marky Roden](https://www.youtube.com/watch?v=k5bDvZg4Gbg) video for SocialBizUG.org.

The initial page for the Houses of AnAppOfIceAndFire (_index.html_) is laid out like almost anyone would expect an _index.html_ file that implements Bootstrap. I've snipped out everything but the &lt;body&gt; tag contents for space.

{% gist "edm00se", "369294c9a2fe54e8c1ec", "index.abbrbeviated.html" %}

The "magic happens" part is where my application code structures in the HTML partials, which I route in, based on my config. We'll get there in a minute, for now, have a look at the two partial HTML files I'm using, one for the collection list and one for the individual house. You may notice that I'm also nesting my House Record inside the House Collection partial, this is one of the nifty features I like about ui-router.

**House Collection**

{% gist "edm00se", "369294c9a2fe54e8c1ec", "partials.houseList.html" %}

**House Record**
For obvious reasons, much more like a form.

{% gist "edm00se", "369294c9a2fe54e8c1ec", "partials.house.html" %}

### AngularJS App

##### 0 - Structure

My app will consist of a few parts. I've broken them apart here into sections, for ease of reading. I've also taken the approach for my app.js of chain-loading each section off the main module definition, decreasing the number of handles for the same object.

##### 1 - Config

I'll first need to configure any routing rules for my HTML partials and resolving URL route parameters as their respective variables; this will happen [in the config](https://docs.angularjs.org/guide/module); the definition is for an Angular "module". Any 3rd party assets get plugged in here, as part of the dependency injection, such as [ui-router](https://github.com/angular-ui/ui-router).

{% gist "edm00se", "369294c9a2fe54e8c1ec", "app.abbreviated.config.js" %}

##### 2 - Services/Factories

Any [services or factories (or providers)](https://docs.angularjs.org/guide/services) get defined here.

{% gist "edm00se", "369294c9a2fe54e8c1ec", "app.abbreviated.factories.js" %}

##### 3 - Controllers

[Controllers](https://docs.angularjs.org/guide/controller) are a binding of functional behavior to sections of the HTML. I have two controllers, each with different scopes. Mine are for my navigation handling and the primary application regarding houses.

{% gist "edm00se", "369294c9a2fe54e8c1ec", "app.abbreviated.controllers.js" %}

##### 4 - Filters

Everyone tends to like directives in AngularJS (I do too), but one of my favorite aspects of AngularJS is the [out-of-the-box Filters](https://docs.angularjs.org/guide/filter) that we get for free. This is an entire subject on its own IMO, but for now, you can see my "startFrom" custom filter; part of my custom paging mechanism for the House Collection.

{% gist "edm00se", "369294c9a2fe54e8c1ec", "app.abbreviated.filters.js" %}

##### 5 - Directives

[Directives](https://docs.angularjs.org/guide/directive) are the higher level "do something" definitions. Most of the AngularJS attributes or tags you write into HTML are directives. As with Filters, you can write your own Directives all you like, but some of the most useful ones come OoB ("out of the box").

{% gist "edm00se", "369294c9a2fe54e8c1ec", "app.abbreviated.directives.js" %}

### Bring It Home

That's basically it. I find that once you isolate what elements of work you have, the pieces don't have to be ugly or scary. In fact, the craziest part of my whole app was defining my clear/cancel and save functions in my House Record Controller, and that was fairly easy.

You can clone my Git repository and play around with it yourself, if you like. <span data-toggle="tooltip" title="why wouldn't I recommend that?">I recommend following the build instructions in the ReadMe included there</span>. Until next time, 🍺.

##### [edm00se/AnAppOfIceAndFire](https://github.com/edm00se/AnAppOfIceAndFire)

<center>
  <iframe
    width="160"
    height="30"
    frameborder="0"
    src="https://ghbtns.com/github-btn.html?user=edm00se&repo=AnAppOfIceAndFire&type=star&count=true&size=large&v=2">
  </iframe>

  <iframe
    width="160"
    height="30"
    frameborder="0"
    src="https://ghbtns.com/github-btn.html?user=edm00se&repo=AnAppOfIceAndFire&type=fork&count=true&size=large&v=2">
  </iframe>
</center>
