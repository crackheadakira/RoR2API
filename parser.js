console.clear();
const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let i = 0;

JSDOM.fromURL("https://riskofrain2.fandom.com/wiki/Category:Items").then(
  (dom1) => {
    dom1.window.document
      .querySelectorAll("#mw-pages > div:nth-child(3) > div:nth-child(1) > div")
      .forEach((item) => {
        item.querySelectorAll("div > ul > li > a").forEach((siteURL) => {
          JSDOM.fromURL(siteURL.href).then((dom) => {
            let infoBox =
              dom.window.document.querySelector("table.infoboxtable");
            let id;
            let category;

            infoBox?.querySelectorAll("tr > td")?.forEach((element) => {
              if (element.textContent.toUpperCase() !== "ID") {
                return;
              }
              return (id = element.nextElementSibling.textContent.replaceAll(
                "\n",
                ""
              ));
            });

            // Deletes all the HTML and splits the categories
            // into an array.
            infoBox?.querySelectorAll("tr > td")?.forEach((element) => {
              if (element.textContent.toUpperCase() !== "CATEGORY") {
                return;
              }
              return (category = element.nextElementSibling.innerHTML
                .replaceAll("\n", "")
                .replace(/<(.|\n)*?>/g, " ")
                .replace(/\s\s+/g, " ")
                .split(" ")
                .filter((value) => Object.keys(value).length !== 0));
            });

            let statObject = {};
            let allStats = [];
            let statRef =
              infoBox?.querySelectorAll("tr > th")[1]?.parentElement
                ?.nextElementSibling;
            let firstSibling = statRef?.nextElementSibling;
            let secondSibling = firstSibling?.nextElementSibling;
            // Get the first and second siblings of the Stats header
            // to get the 2 columns below it, or just one if there
            // isn't a second one.

            let rarity = infoBox
              ?.querySelectorAll("tr > td + td")[0]
              ?.textContent.replaceAll("\n", "")
              .replace(/ *\([^)]*\) */g, "");
            let statTitles = statRef?.textContent
              .split("\n")
              .filter((value) => Object.keys(value).length !== 0);
            allStats.push(
              firstSibling?.textContent
                .split("\n")
                .filter((value) => Object.keys(value).length !== 0),
              secondSibling?.textContent
                .split("\n")
                .filter((value) => Object.keys(value).length !== 0)
            );

            // Checks if the stats have two columns, and if so
            // put it inside the object, otherwise have just
            // the first column.
            for (let i = 0; i < statTitles?.length; i++) {
              statObject[statTitles[i]] = allStats[0][i];
              if (allStats[1] !== undefined) {
                statObject[statTitles[i]] = {
                  column1: allStats[0][i],
                  column2: allStats[1][i],
                };
              }
            }

            let object = {
              id: id || "Unknown",
              title: decodeURI(
                dom?.window.location.href
                  .split("/wiki/")[1]
                  .replaceAll("_", " ")
              ),
              category: category,
              description: {
                textDescription: infoBox
                  ?.querySelector(".infoboxcaption")
                  ?.textContent.replaceAll("\n", ""),
                advancedDescription: infoBox
                  ?.querySelector(".infoboxdesc")
                  ?.textContent.replaceAll("\n", ""),
              },
              rarity: rarity,
              stats: statObject,
            };

            try {
              if (!fs.accessSync(`./files/${rarity}/${id || "unknown"}.json`)) {
                fs.writeFileSync(
                  `./files/${rarity}/${id || "unknown" + i}.json`,
                  JSON.stringify(object)
                );
                i++;
              }
            } catch (exc) {
              fs.writeFileSync(
                `./files/${rarity}/${id || "unknown"}.json`,
                JSON.stringify(object)
              );
            }
          });
        });
      });
  }
);
