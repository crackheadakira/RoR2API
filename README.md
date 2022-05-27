# **Risk of Rain 2 API**

<p  align="center">

<a  href="https://wakatime.com/badge/user/62fa37e7-7294-4c8f-91bc-7b49c9c136cb/project/7d57186a-bd1d-450f-8cc3-6e6ca5ffaa47"  alt="Time spent on project (Wakatime)"> <img  src="https://wakatime.com/badge/user/62fa37e7-7294-4c8f-91bc-7b49c9c136cb/project/7d57186a-bd1d-450f-8cc3-6e6ca5ffaa47.svg"/> </a>

</p>

---

_( All the info I used for the JSON files came from the [Risk of Rain 2 Wiki](https://riskofrain2.fandom.com/wiki/Risk_of_Rain_2_Wiki) )_

This all originated from when I wanted to try learning Vue, so I decided on a site that shows you all the items Risk of Rain 2 has. But I ran into a problem, there was no simple online database with all the info I needed.

At first I was unsure on whether or not to use GraphQL or REST, but I ended up going with REST as I had no experience with REST so I took this as a learning experience, so after some "intense" watching on YouTube, I started to write the `app.js` file but I quickly realized it would be too tedious to manually have to create an entry for each item. That's when a friend of mine, [Fülöp Tibor](https://github.com/TibixDev), recommended I take this as a chance to learn JSDom too, and after some careful consideration I put his recommendation on the backburner, and kept on writing. As I was finishing up the `app.js` I started to dread the next part, writing the entries.

That's when I remembered JSDom, and started googling more about it, and the more I read about it the more feasible it seemed. After installing JSDom using NPM, I type in the very magical words `const jsdom = require('jsdom')`, and start testing away.
After succesfully being able to recursively read all the urls from the [wiki](https://riskofrain2.fandom.com/wiki/Items), I noticed it also grabbed the URLs at the bottom causing me to go a bit insane trying to find a fix for this. I tried for about an hour or two until I accepted my defeat for the day and went to bed.
The very next day when I had woken up I went back to the wiki to look at some random item I had thought of in the wiki, and right then and there I noticed something at the top left.. `in: Items`, I clicked on it expecting it to lead me to the very same page I had been using to parse, but no. It led to me an entirely different page with exactly the content I needed, this [page](https://riskofrain2.fandom.com/wiki/Category:Items) had been my saving grace. It allowed me to parse all the URLs correctly without even needing to alter the existing code that much, and with that out of the way it was time to write the rest of the parser.

Sadly I had not made a GitHub repository yet for this project, and did not end up doing so until finishing the project, leading me to not having any of the old code saved in history, only in memory, but even then I will attempt to write the events as they had happened in my memory.

Before continuing with writing the rest of the parser, I made myself a mental checklist, the parser has to be able to get all the information I had deemed important, such as the `id, title, category, description, rarity and the stats`, I had also hoped to get the formulas for exponential and hyperbolic items but sadly the formulas for the items were images, therefore not being parsable.

After making that checklist, I began by getting the title, I had begun with getting it from the information table header, but that soon started to become a problem, specifically with the void items. The void items had a span right next to the Image in the same div that was hidden, so whenever I parsed it it also parsed the text contents inside it, as JSDom didn't have a `.innerText` function. After banging some rocks together for some minutes I come up with the solution to just get the title from the URL, since the URL always featured `/wiki${itemTitle}`.
It was very simple to get the simple, all I had to do was just get the URL by doing `dom?.window.location.href` and just seperating it into two different strings at the `/wiki/` point, and then selecting the 2nd element inside the array which was the title, but it was formatted like this `57_Leaf_Clover`, so I replaced the `_` characters with spaces, and that worked perfectly, then came the URL with an percent-encoding. It was Will-o'-the-wisp, but the title didn't look like that, it instead looked like `Will-o%27-the-wisp`.
After doing some quick googling I found out about the `decodeURI()` function which was exactly what I needed, so I just added that to the title, and that was exactly what I needed, after adding that this is what the code ended up looking like `decodeURI(dom?.window.location.href.split("/wiki/")[1].replaceAll("_", " ")`, there's probably some much easier way to do this, but this is what I ended up going with for it's "simplicity".
Next came the categories and id's.

I began with the ID parameter, and the result ended up being a bit hacky to say the least, I had no idea how to fetch it as it was in quite a tricky spot. I realized I could just simply get every single element like it and then check if the text content was ID, and if it wasn't just skip over it, and it worked perfectly. Once I had that working, I just had to get the actual ID, which was a sibling element of the ID text I had been checking for, so I just did `element.nextElementSibling` to get the number, and with the ID out of the way I was ready to get working on the category. but then I realized I could just use the exact code as I had for the ID and replace the ID with Category.
The only thing I had to do was write some extra code for the category as there were sometimes multiple categories on one single item and I wanted to get every single one of them. I am quite lazy to explain this, so to quickly explain it, I took the innerHTML of the categories and then deleted all the HTML tags, as I needed a definite space between the categories, then I split the categories into different elements inside an array by using the space character, then using a filter for the array I removed all the empty elements.
