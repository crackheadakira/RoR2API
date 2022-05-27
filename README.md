
#  **Risk of Rain 2 API**

<p  align="center">
<a  href="https://wakatime.com/badge/user/62fa37e7-7294-4c8f-91bc-7b49c9c136cb/project/7d57186a-bd1d-450f-8cc3-6e6ca5ffaa47"  alt="Time spent on project (Wakatime)">  <img  src="https://wakatime.com/badge/user/62fa37e7-7294-4c8f-91bc-7b49c9c136cb/project/7d57186a-bd1d-450f-8cc3-6e6ca5ffaa47.svg"/>  </a>  <br>
<strong>( All the info I used for the JSON files came from the <a  href="https://riskofrain2.fandom.com/wiki/Risk_of_Rain_2_Wiki">Risk of Rain 2 Wiki</a> ) </strong>
</p>

## 0.1 The Beginnings

This all originated from when I wanted to try learning Vue, but I was unsure on what project to make but by a saving grace I had just started to play Risk of Rain 2 recently so I ended up deciding on a site that shows you all the items Risk of Rain 2 has. But I ran into a problem, there was no simple API with all the info I needed, only the wiki.

I dove head in and started googling about what could be used to make API's, and I stumbled upon to REST and GraphQL. I've had expereince with GraphQL before, that was when I was making [my discord bot](https://github.com/crackheadakira/TheCultureMan). At first I was unsure on which one to use, GraphQL or REST. I decided on going with REST as I had no experience with REST so I saw this as a learning experience ( again ), so after some "intense" watching on YouTube, I started to write the `app.js` file but I quickly realized it would be too tedious to manually have to create an entry for each item. That's when a friend of mine, [Fülöp Tibor](https://github.com/TibixDev), recommended JSDom, I quickly saw this as a chance to learn JSDom too, but after some careful consideration I put his recommendation on the backburner, and kept on writing. As I was finishing up the `app.js` I started to dread the next part, writing the entries.

## 0.2 JSDom

That's when I remembered JSDom, and started googling about it, and the more I read about it the more feasible it seemed. After installing JSDom using NPM, I typed in these very magical words


```javascript
const  jsdom  =  require("jsdom");
const { JSDOM } =  jsdom;
```

and started testing away.

After successfully being able to recursively read all the URLs from the [wiki](https://riskofrain2.fandom.com/wiki/Items), I started looking at the data and noticed it also grabbed the URLs at the bottom of the page, which was information that wasn't relevant to what I was trying to get. I tried to fix this for about an hour or two, but it was very late by then so I just accepted my defeat for the day and went to bed.

The very next day I woke up, and just didn't touch the project very much until later towards the afternoon when I was playing Risk of Rain 2 and wanted to check the stats of an item, and right then and there on the wiki page I noticed something at the top left— `in: Items`, I clicked on the Items URL expecting it to lead me to the very same page I had been using to parse, but no. It led to me an entirely different page with exactly the content I needed, nothing extra, this [page](https://riskofrain2.fandom.com/wiki/Category:Items) had been my saving grace. It allowed me to parse all the URLs correctly without even needing to alter the existing code that much, and with that out of the way it was time to write the rest of the parser.

Sadly I had not made a GitHub repository yet for this project, and did not end up doing so until finishing the project, leading me to not having any of the old code saved in history, only in memory, but even so I will attempt to write the events as they had happened from my memory.

Before continuing with writing the rest of the parser, I made myself a mental checklist, the parser has to be able to get all the information I had deemed important, such as the id, title, category, description, rarity and the stats of the item, I had also hoped to get the formulas for exponential and hyperbolic items but sadly the formulas for the items were being stored as images, therefore not being parsable.

### The Title

After making that checklist, I began with what I thought would be one of the simplest tasks, the title. I begun with parsing it from the information table header, but that soon revealed a problem, specifically a problem with parsing the void items. The void items had an image right next to the title of the item inside the same div that contained text that was hidden to the user unless they were on mobile I assume, so whenever I parsed it it also parsed the text inside it, as JSDom didn't have a `.innerText` function that allowed you to get the text just as the user saw it instead of from the source code. After banging some rocks together for some minutes I came up with the solution to just get the title from the URL, since the URL always featured the item title, and it had a very simple identifier, it came after `/wiki`
<br>
It was very simple to get the simple, all I had to do was just get the URL by doing `dom?.window.location.href`, to very briefly explain what that snippet of code does, it takes the URL from the address bar. I then separated the URL into an array by using `/wiki/` as the point on where to split it. I then selected the second element inside the array, which would be the title of the item, but I still wasn't done as the title was formatted like this `57_Leaf_Clover`, so I had to replace all the underscores with spaces, and that worked perfectly, until there was an URL that featured [percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding). It was Will-o'-the-wisp, but the title didn't look like that, it instead looked like `Will-o%27-the-wisp`.
<br>
After doing some quick googling to figure out what was causing this I found a solution. It was the `decodeURI()` function which was exactly what I needed, it just took all the percent-encodings and turned them back into regular characters, so I just added that to the title code, and it worked like a charm, after adding that this is what the code ended up looking like
<br>
```javascript
decodeURI(dom?.window.location.href.split("/wiki/")[1].replaceAll("_", "  ")
```
There's probably some much easier way to do this, but this is what I ended up going with for it's "simplicity".
<br>
### The ID
<br>
Next came the categories and id's of the items.
I began with the ID parameter, and the result ended up being a bit hacky to say the least, I had no idea how to fetch it as it was in quite a tricky spot. After testing for some time I noticed I could just parse all the items and then jump over those if they didn't feature the text ID. I realized I could just simply get every single element that featured the same structure and then check if the text inside the element was ID, and if it wasn't just skip over it, and it worked perfectly. Once I had that working, I just had to get the actual ID, which was a sibling element of the ID text I had been checking for, so to access the sibling element I did `element.nextElementSibling`, which was the number, and with the ID out of the way I was ready to get working on the category. but then I realized I could just reuse a majority of the code I had just made for ID.
<br>
### The Categories
<br>
The only thing I had to do was write some extra code for the category as sometimes there were multiple categories on a single item and I wanted to get every single one of them. I won't go into how it functions very deeply, but I will quickly speed through it. I first took the inner HTML of the categories div and then deleted all the HTML tags. I had to do this method as I needed a definite space between the categories because If i just took the text content by itself it mushed all the categories into one word, then I split the categories into different elements, again by using `.split` but by having the space be the identifier this time, then I took out all the elements inside the array that were just empty, and that left me with a perfect array that featured all the categories.
<br>
## 0.3 Conclusion
<br>
So in conclusion this all had stemmed from me wanting to learn Vue but quickly branched into me learning how to make a REST API and how to use JSDom.
