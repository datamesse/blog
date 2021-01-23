---
layout: post
title: Import time zone offsets and observation anchors from Wikipedia
date: 2021-01-23 16:56:00 +1100
description: Using Power Query in Power BI to extract timezone and daylight saving observation periods from Wikipedia. # Add post description (optional)
img: # /assets/images/?????.jpg no longer works
tags: [Power BI, Power Query, M, Date.DayOfWeek] # add tag
---

Two exercises in importing data from Wikipedia web pages using Power BI.

Here we will be importing Wikipedia table data from 2 different pages. The first example contains structured and straight forward data values requiring minimal formatting for data cleaning. The second contains data which requires disaggregation of qualitative information to make it more quantitative.

Time zone offset hours
[https://en.wikipedia.org/wiki/List_of_tz_database_time_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

![Wikipedia List of tz database time zones](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/01.png?raw=true)


Daylight Saving observation period anchors
[https://en.wikipedia.org/wiki/Daylight_saving_time_by_country](https://en.wikipedia.org/wiki/Daylight_saving_time_by_country)

![Wikipedia Daylight saving time by country](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/02.png?raw=true)

**Exercise 1:**

Beginning with the time zone offset hours, we Get Data from Web and provide the URL

![Power BI Import data from a web page](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/03.png?raw=true)

Because Wikipedia is the data source, we select the Basic option with the intention of exporting the results to Excel to keep afterward, as opposed to a live ongoing connection. This is to mitigate problems regarding page changes, and the data we are after we will be assuming as persisting.

![Power BI Import data Basic setting and set URL](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/04.png?raw=true)

The HTML table we are after is the list containing the offsets.
Tick it, then click Transform Data.

![Power BI Import data web page table selection](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/05.png?raw=true)

Next we Use First Row as Headers to assign the column names.

![Power Query Use First Row as Headers](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/06.png?raw=true)

Then we add new custom columns to substitute existing columns to clean the data.

First we add a new column to substitute the TZ database name column, replacing the single forward slashes “/” with forward slashes surrounded by spaces “ / “, and replace the underscores “_” with spaces “ “, for readability.

```
Text.Replace(Text.Replace([TZ database name],"/", ", "),"_"," ")
```

![Power Query Replace text to make more readable](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/07.png?raw=true)

Secondly, the data source’s offsets use a different dash character "−" (slightly longer) from the mathematical operator "-" (shorter), so we need to create custom columns to substitute the longer dash with the shorter one.

For the Standard UTC offset:

```
Text.Replace([#"UTC offset ±hh:mm"],"−","-")
```
![Power Query Custom Column: Standard UTC offset ](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/08.png?raw=true)

For the Daylight Saving UTC offset:

```
Text.Replace([#"UTC DST offset ±hh:mm"],"−","-")
```
![Power Query Custom Column: Daylight Saving UTC offset](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/09.png?raw=true)

Now to add a column that shows the difference between the standard and daylight savings offsets.
The nature of the data means you cannot subtract them in a simple way.
Comments are included in the code to explain what is occurring.

```
/* If the offsets are identical, it may imply no Daylight Saving observed */
if [Standard UTC offset] = [Daylight Saving UTC offset]
then 0
/* If minutes are the same and aren't zero, just subtract hours */
else if (Text.End([Standard UTC offset],2) <> "00" or 
Text.End([Daylight Saving UTC offset],2) <> "00") and Text.End([Standard UTC offset],2) = Text.End([Daylight Saving UTC offset],2)
then Number.FromText(Text.Range([Daylight Saving UTC offset],0,3)) - Number.FromText(Text.Range([Standard UTC offset],0,3))
/* If minutes are different and either of them aren't zero, convert minutes to proper decimals, subtract, then convert minutes back */
else if (Text.End([Standard UTC offset],2) <> "00" or 
Text.End([Daylight Saving UTC offset],2) <> "00") and Text.End([Standard UTC offset],2) <> Text.End([Daylight Saving UTC offset],2)
then (Number.FromText(Text.Range([Daylight Saving UTC offset],1,2)) + (Number.FromText(Text.End([Daylight Saving UTC offset],2)) / 60)) - (Number.FromText(Text.Range([Standard UTC offset],1,2)) + (Number.FromText(Text.End([Standard UTC offset],2)) / 60))
/* Standard expectation that difference is only in the hour values */
else Number.FromText(Text.Range([Daylight Saving UTC offset],1,2)) - Number.FromText(Text.Range([Standard UTC offset],1,2))
```

![Power Query Custom Column: Offset difference](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/10.png?raw=true)

Next we filter out the data rows not required, starting with only including Canonical status offsets

![Power Query Filter for Canonical records](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/11.png?raw=true)

Then we filter for time zones that have a country code.

![Power Query Filter for country codes](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/12.png?raw=true)

Lastly, remove columns that won’t be needed, depending on what you need for your data source.

![Power Query Remove other columns](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/13.png?raw=true)

In my scenario, I want to retain this data separately in an Excel file, so I create a table in Power BI with all the columns, then Export.

![Power BI Export table results](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/14.png?raw=true)


Final Power Query M code:
```
let
    Source = Web.BrowserContents("https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"),
    #"Extract HTML table from Wikipedia" = Html.Table(Source, {{"Column1", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(1)"}, {"Column2", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(2)"}, {"Column3", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(3)"}, {"Column4", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(4)"}, {"Column5", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(5)"}, {"Column6", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(6)"}, {"Column7", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(7)"}, {"Column8", "TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR > :nth-child(8)"}}, [RowSelector="TABLE.wikitable.sortable.jquery-tablesorter:nth-child(9) > * > TR"]),
    #"Promote first row as headers" = Table.PromoteHeaders(#"Extract HTML table from Wikipedia", [PromoteAllScalars=true]),
    #"Add timezone column" = Table.AddColumn(#"Promote first row as headers", "Timezone", each Text.Replace(Text.Replace([TZ database name],"/", ", "),"_"," ")),
    #"Add Standard UTC offset column" = Table.AddColumn(#"Add timezone column", "Standard UTC offset", each Text.Replace([#"UTC offset ±hh:mm"],"−","-")),
    #"Add Daylight Saving UTC offset column" = Table.AddColumn(#"Add Standard UTC offset column", "Daylight Saving UTC offset", each Text.Replace([#"UTC DST offset ±hh:mm"],"−","-")),
    #"Add Daylight offset - Standard offset column" = Table.AddColumn(#"Add Daylight Saving UTC offset column", "Daylight offset - Standard offset", each /* If the offsets are identical, it may imply no Daylight Saving observed */
if [Standard UTC offset] = [Daylight Saving UTC offset]
then 0
/* If minutes are the same and aren't zero, just subtract hours */
else if (Text.End([Standard UTC offset],2) <> "00" or 
Text.End([Daylight Saving UTC offset],2) <> "00") and Text.End([Standard UTC offset],2) = Text.End([Daylight Saving UTC offset],2)
then Number.FromText(Text.Range([Daylight Saving UTC offset],0,3)) - Number.FromText(Text.Range([Standard UTC offset],0,3))
/* If minutes are different and either of them aren't zero, convert minutes to proper decimals, subtract, then convert minutes back */
else if (Text.End([Standard UTC offset],2) <> "00" or 
Text.End([Daylight Saving UTC offset],2) <> "00") and Text.End([Standard UTC offset],2) <> Text.End([Daylight Saving UTC offset],2)
then (Number.FromText(Text.Range([Daylight Saving UTC offset],1,2)) + (Number.FromText(Text.End([Daylight Saving UTC offset],2)) / 60)) - (Number.FromText(Text.Range([Standard UTC offset],1,2)) + (Number.FromText(Text.End([Standard UTC offset],2)) / 60))
/* Standard expectation that difference is only in the hour values */
else Number.FromText(Text.Range([Daylight Saving UTC offset],1,2)) - Number.FromText(Text.Range([Standard UTC offset],1,2))),
    #"Filter for Canonical and country coded offsets only" = Table.SelectRows(#"Add Daylight offset - Standard offset column", each ([Status] = "Canonical") and ([Country code] <> "")),
    #"Remove unnecessary columns" = Table.SelectColumns(#"Filter for Canonical and country coded offsets only",{"Country code", "Timezone", "Standard UTC offset", "Daylight Saving UTC offset", "Daylight offset - Standard offset"})
in
    #"Remove unnecessary columns"
```



**Exercise 2:**

For our second data set, we need to retrieve the relative anchors for daylight saving periods using the second URL: [https://en.wikipedia.org/wiki/Daylight_saving_time_by_country](https://en.wikipedia.org/wiki/Daylight_saving_time_by_country)

![Power BI Import data Basic setting and set URL](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/15.png?raw=true)

Again, click Transform Data and Use First Row as Headers.

![Power BI Import data web page table selection](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/16.png?raw=true)

![Power Query Use First Row as Headers](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/17.png?raw=true)

Next we filter for records with a valid current DST start value.

![Power Query Filter for valid DST start](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/18.png?raw=true)

The problem with this dataset is that the DST start and DST end columns are not quantified at a low enough level to be easily worked with. Hence why it is recommended to employ a better dataset, which accurately (and easily) provides the information, depending on your requirements and data availability.

However, as it is possible others may encounter this kind of data, this is one approach to work with such a dataset, when other options may not be available.

Revising these columns, we can see value commonalities that can be separated out into custom columns as “anchors” for each daylight saving period’s start and end. This includes:

• Positions (i.e. first, second, third, fourth, last)
• Weekday names
• Month names
• “UTC” prefixed with a specific UTC time (e.g. 01:00 UTC), or prefixed with a non-UTC time (e.g. 002:00 AST (UTC-4)
• Phrases “local standard time” and “local daylight saving time” prefixed with a time

![Power Query Exploring qualitative data values](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/19.png?raw=true)

The custom columns will be simple conditions that check for substrings and substitute them with numerical data where possible, so they can be efficiently stored and referenced by custom functions we may make in future.

We’ll begin with the position-related column.

Every day has at least four occurrences in each month, but the “last” position could either be the fourth or fifth occurrence of that day. I chose to use an arbitrary value of 9 for the output of last, given 5 could possibly be used for the fifth instance of the day. Though with this particular dataset, nether Fourth nor Fifth occur, so they can be omitted here.

```
if Text.Contains([DST start], "First")
then 1
else if Text.Contains([DST start], "Second")
then 2
else if Text.Contains([DST start], "Third")
then 3
else if Text.Contains([DST start], "Fourth")
then 4
else if Text.Contains([DST start], "Fifth")
then 5
else if Text.Contains([DST start], "Last")
then 9
else null
```

![Power Query Custom Column: DST start position anchor](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/20.png?raw=true)

Next to create a custom column for the weekdays, using Power Query’s Day functions, which translate as numbers from 0 for Sunday to 6 for Saturday.

```
if Text.Contains([DST start], "Sunday")
then Day.Sunday
else 
if Text.Contains([DST start], "Monday")
then Day.Monday
else 
if Text.Contains([DST start], "Tuesday")
then Day.Tuesday
else 
if Text.Contains([DST start], "Wednesday")
then Day.Wednesday
else 
if Text.Contains([DST start], "Thursday")
then Day.Thursday
else 
if Text.Contains([DST start], "Friday")
then Day.Friday
else 
if Text.Contains([DST start], "Saturday")
then Day.Saturday
else null
```

![Power Query Custom Column: DST start day anchor](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/21.png?raw=true)

We repeat with similar logic for the DST start field’s month anchor. At time of writing, Power Query has a function that converts month numbers to month names, but not the other way around.

```
if Text.Contains([DST start], "January")
then 1
else if Text.Contains([DST start], "February")
then 2
else if Text.Contains([DST start], "March")
then 3
else if Text.Contains([DST start], "April")
then 4
else if Text.Contains([DST start], "May")
then 5
else if Text.Contains([DST start], "June")
then 6
else if Text.Contains([DST start], "July")
then 7
else if Text.Contains([DST start], "August")
then 8
else if Text.Contains([DST start], "September")
then 9
else if Text.Contains([DST start], "October")
then 10
else if Text.Contains([DST start], "November")
then 11
else if Text.Contains([DST start], "December")
then 12
else null
```

![Power Query Custom Column: DST start month anchor](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/22.png?raw=true)

Lastly, we will pull where a UTC time is specified. There are entries where a local time with its UTC offset value is provided, but since these entries are few and complex to manage, I will edit the export result afterward to account for these. It’s a cost vs benefit juggle.

`if Text.Contains([DST start], " UTC") then Text.Range([DST start], Text.PositionOf([DST start]," UTC") - 5, 5) else null `

![Power Query Custom Column: DST start UTC time anchor](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/23.png?raw=true)

Rinse-and-repeat the creation of those anchor columns, but for the DST end column. Depending on how complex and how much repetition is involved with your own dataset, you can consider creating a custom function to make modelling easier to manage later on.

![Power Query Custom Columns for DST end](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/24.png?raw=true)

Then we can retain the columns we need, such as Country/Territory, Notes, and the custom columns we created.

![Power Query Remove other columns](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/25.png?raw=true)

Lastly, as with the previous dataset, we will export this to Excel, and clean up the file from there, e.g. accounting for records that have different data structure for their anchors, such as an exact date for day and month per year, and records that include local time, etc.

![Power BI Export table results](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/26.png?raw=true)

At this point, we typically would merge these datasets, similar to left outers join in SQL. Unfortunately, the first dataset uses an incoherent structure for its time zone name values, e.g. _country, city_ or _region, city_ or _region, country, city_ etc., as opposed to the second data set, which only lists country.

![Power Query Merge Queries](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/27.png?raw=true)

I tried fuzzy matching, but as at time of writing, it cannot connect a high enough number of the records, regardless of adjustments made to the accuracy.

![Power Query Merge using fuzzy matching](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/28.png?raw=true)

An alternative solution would be to create a list based on the second dataset’s county column, but this would neglect the _region, city_ joins from the first dataset. Another would be to find a third dataset to extend the other datasets and formulate a common column for the merge. In my scenario, the cost vs benefit would be more time efficient to do the mapping manually, and this dataset is small, and intended for a niche non-scaled need. I provided a copy of the end product [here](https://github.com/datamesse/blog/blob/master/assets/attachments/Time_zone_offsets_and_DST_observations.xlsx?raw=true) to download as an Excel file. As a reminder, this is strictly an exercise file, and its data is not comprehensive nor accurate.

![Manually cleaned output](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-01-23-import-time-zone-offsets-and-observation-anchors-from-wikipedia/29.png?raw=true)



Final Power Query M code:
```
let
    Source = Web.BrowserContents("https://en.wikipedia.org/wiki/Daylight_saving_time_by_country"),
    #"Extract HTML table from Wikipedia" = Html.Table(Source, {{"Column1", "TABLE.wikitable.sortable > * > TR > :nth-child(1)"}, {"Column2", "TABLE.wikitable.sortable > * > TR > :nth-child(2)"}, {"Column3", "TABLE.wikitable.sortable > * > TR > :nth-child(3)"}, {"Column4", "TABLE.wikitable.sortable > * > TR > :nth-child(4)"}, {"Column5", "TABLE.wikitable.sortable > * > TR > :nth-child(5)"}, {"Column6", "TABLE.wikitable.sortable > * > TR > :nth-child(6)"}}, [RowSelector="TABLE.wikitable.sortable > * > TR"]),
    #"Promote first row as headers" = Table.PromoteHeaders(#"Extract HTML table from Wikipedia", [PromoteAllScalars=true]),
    #"Filter for valid daylight saving observations" = Table.SelectRows(#"Promote first row as headers", each ([DST start] <> "–")),
    #"Add DST start (position anchor) column" = Table.AddColumn(#"Filter for valid daylight saving observations", "DST start (position anchor)", each if Text.Contains([DST start], "First")
then 1
else if Text.Contains([DST start], "Second")
then 2
else if Text.Contains([DST start], "Third")
then 3
else if Text.Contains([DST start], "Fourth")
then 4
else if Text.Contains([DST start], "Fifth")
then 5
else if Text.Contains([DST start], "Last")
then 9
else null),
    #"Add DST start (day anchor) column" = Table.AddColumn(#"Add DST start (position anchor) column", "DST start (day anchor)", each if Text.Contains([DST start], "Sunday")
then Day.Sunday
else 
if Text.Contains([DST start], "Monday")
then Day.Monday
else 
if Text.Contains([DST start], "Tuesday")
then Day.Tuesday
else 
if Text.Contains([DST start], "Wednesday")
then Day.Wednesday
else 
if Text.Contains([DST start], "Thursday")
then Day.Thursday
else 
if Text.Contains([DST start], "Friday")
then Day.Friday
else 
if Text.Contains([DST start], "Saturday")
then Day.Saturday
else null),
    #"Add DST start (month anchor) column" = Table.AddColumn(#"Add DST start (day anchor) column", "DST start (month anchor)", each if Text.Contains([DST start], "January")
then 1
else if Text.Contains([DST start], "February")
then 2
else if Text.Contains([DST start], "March")
then 3
else if Text.Contains([DST start], "April")
then 4
else if Text.Contains([DST start], "May")
then 5
else if Text.Contains([DST start], "June")
then 6
else if Text.Contains([DST start], "July")
then 7
else if Text.Contains([DST start], "August")
then 8
else if Text.Contains([DST start], "September")
then 9
else if Text.Contains([DST start], "October")
then 10
else if Text.Contains([DST start], "November")
then 11
else if Text.Contains([DST start], "December")
then 12
else null),
    #"Add DST start (UTC time anchor) column" = Table.AddColumn(#"Add DST start (month anchor) column", "DST start (UTC time anchor)", each if Text.Contains([DST start], " UTC")
then Text.Range([DST start], Text.PositionOf([DST start]," UTC") - 5, 5)
else null),
    #"Add DST end (position anchor) column" = Table.AddColumn(#"Add DST start (UTC time anchor) column", "DST end (position anchor)", each if Text.Contains([DST end], "First")
then 1
else if Text.Contains([DST end], "Second")
then 2
else if Text.Contains([DST end], "Third")
then 3
else if Text.Contains([DST end], "Fourth")
then 4
else if Text.Contains([DST end], "Fifth")
then 5
else if Text.Contains([DST end], "Last")
then 9
else null),
    #"Add DST end (day anchor) column" = Table.AddColumn(#"Add DST end (position anchor) column", "DST end (day anchor)", each if Text.Contains([DST end], "Sunday")
then Day.Sunday
else 
if Text.Contains([DST end], "Monday")
then Day.Monday
else 
if Text.Contains([DST end], "Tuesday")
then Day.Tuesday
else 
if Text.Contains([DST end], "Wednesday")
then Day.Wednesday
else 
if Text.Contains([DST end], "Thursday")
then Day.Thursday
else 
if Text.Contains([DST end], "Friday")
then Day.Friday
else 
if Text.Contains([DST end], "Saturday")
then Day.Saturday
else null),
    #"Add DST end (month anchor) column" = Table.AddColumn(#"Add DST end (day anchor) column", "DST end (month anchor)", each if Text.Contains([DST end], "January")
then 1
else if Text.Contains([DST end], "February")
then 2
else if Text.Contains([DST end], "March")
then 3
else if Text.Contains([DST end], "April")
then 4
else if Text.Contains([DST end], "May")
then 5
else if Text.Contains([DST end], "June")
then 6
else if Text.Contains([DST end], "July")
then 7
else if Text.Contains([DST end], "August")
then 8
else if Text.Contains([DST end], "September")
then 9
else if Text.Contains([DST end], "October")
then 10
else if Text.Contains([DST end], "November")
then 11
else if Text.Contains([DST end], "December")
then 12
else null),
    #"Add DST end (UTC time anchor)" = Table.AddColumn(#"Add DST end (month anchor) column", "DST end (UTC time anchor)", each if Text.Contains([DST end], " UTC")
then Text.Range([DST end], Text.PositionOf([DST end]," UTC") - 5, 5)
else null),
    #"Remove unnecessary columns" = Table.SelectColumns(#"Add DST end (UTC time anchor)",{"Continent/Subregion", "Country/Territory", "DST start (position anchor)", "DST start (day anchor)", "DST start (month anchor)", "DST start (UTC time anchor)", "DST end (position anchor)", "DST end (day anchor)", "DST end (month anchor)", "DST end (UTC time anchor)", "Notes[1]"})
in
    #"Remove unnecessary columns"
```
