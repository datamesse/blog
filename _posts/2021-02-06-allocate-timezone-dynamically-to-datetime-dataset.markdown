---
layout: post
title: Apply time zone to date/times using parameters and anchor values
date: 2021-02-06 18:15:00 +1100
description: Using Power BI parameter to assign time zone to a date/time dataset and apply daylight saving offsets. # Add post description (optional)
img: # /assets/images/?????.jpg no longer works
tags: [Power BI, Power Query, M, parameter, Zendesk, Explore, time zone] # add tag
---

How I used a Power BI parameter to apply a time zone to a date/time dataset.

![Power BI Tokyo example](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/01.png?raw=true)


This may be required in (admittedly rare) instances where date/time values reflect a time zone, but that time zone may vary at access or export.

An example where I work with this, is runnning manual data exports from Explore, the reporting tool for the Zendesk customer service platform. In this scenario, date/time values in exports are automatically converted to match the standard time zone of the extractor's Zendesk login.

This poses two problems:

1 - If multiple people from different time zones are creating or maintaining dashboards not made in the native Explore tool (e.g. via Power BI), their extract date times will be inconsistent.

There are simple ways around this:
* Creating a shared Zendesk account fixed to a specific time zone for data extracts.
* Having access to an API, but [this is not available as at time of writing](https://support.zendesk.com/hc/en-us/community/posts/360038004534-Explore-API).

2 - Zendesk Explore appears to not correctly account for Daylight Savings. This is seen when comparing tickets with the DST offsets against Explore exports.

In this use case, we are creating custom functions that provide the opportunity to reconcile those extract time zone discrepancies, i.e. being able to amend date/times where daylight savings were not applied to the original data.

This post incorporates previous posts to [import time zone and daylight saving observations from Wikipedia](https://datamesse.github.io/blog/2021/01/23/import-time-zone-offsets-and-observation-anchors-from-wikipedia.html), which uses "anchors" to indicate when these are applied (e.g. first Sunday of October), and [how to convert anchors to a usable date](https://datamesse.github.io/blog/2021/01/16/power-bi-find-1st-2nd-3rd-specific-day-of-a-month.html).

As a reminder, this is not an appropriate solution to time zone application in terms of data accuracy, processing efficiency, and coding involved. Ideally a predefined dataset or an API with actual date/time values for observation period start/ends would be best.

A good example of this can be found in [a blog post by John White](https://whitepages.unlimitedviz.com/2020/10/dynamic-time-zone-conversion-using-power-bi/)

This post shows how date/time anchor values can be used, and me making the best with what I've got.

This is the [sample date/time dataset](https://github.com/datamesse/blog/blob/master/assets/attachments/Date_times_to_convert.xlsx?raw=true) we will dynamically apply a time zone to via parameter selection.

Note there is no time zone in the data itself, so assumptions made by any application (e.g. user's machine time zone) could be incorrect.
![Sample date time dataset in Excel](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/02.png?raw=true)

![Sample date time dataset imported into Power Query](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/03.png?raw=true)

After importing the sample date/time dataset, we next import the combined time zone offset and daylight savings observation [dataset](https://github.com/datamesse/blog/blob/master/assets/attachments/Time_zone_offsets_and_DST_observations.xlsx?raw=true) created in this [post](https://datamesse.github.io/blog/2021/01/23/import-time-zone-offsets-and-observation-anchors-from-wikipedia.html).

At this point, if you only need certain time zones to select from, you can filter for them here before proceeding.

![Offset and observation dataset imported into Power Query](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/04.png?raw=true)

Next, we will create a list from the Timezone column, to be used as the available selections of the parameter.

![Power Query Convert to List Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/05.png?raw=true)

![Power Query Convert to List Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/06.png?raw=true)

Then set up the parameter itself to pull from that list.

![Power Query Create new parameter](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/07.png?raw=true)

![Power Query Manage Parameters Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/08.png?raw=true)

![Power Query Manage Parameters Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/09.png?raw=true)

Next, we create a new column in the sample dataset whose value is the parameter selection.

![Power Query custom column for Parameter value Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/10.png?raw=true)

![Power Query custom column for Parameter value Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/11.png?raw=true)

Then merge the two datasets using that new custom column.
![Power Query Merge Queries](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/12.png?raw=true)

![Power Query Merge Queries](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/13.png?raw=true)

Whilst expanding the merged table, we can prefix the column names, which may be useful if intending to merge multiple times, e.g. parameter for data source's actual time zone vs parameter for desired time zone. We will only do the merge once, in this example.

![Power Query expand merge queries Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/14.png?raw=true)

![Power Query expand merge queries Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/15.png?raw=true)

Our next step is to create a custom column to convert our Date/Time value to match the time zone of the parameter selection.
This isn't as simple as appending an offset to our Date/Time value, because of these considerations:
a) The need to account for different Date/Time offsets based on standard vs daylight savings.
b) The anchor dataset (which determines whether or not daylight savings is applied) has a mix of data structures e.g. anchor date/times can be either UTC or local time-based, and can either have a specific date of the month, or relative day position of the month.
c) The datasets' standard and daylight saving offset values are in a text based structure e.g. "+10:00", rather than straight numbers, which are more easily consumed by Power Query functions (e.g. *DateTime.AddZone()*).

To do this, we will create 3 custom functions.
1. A simple suffix of the standard or daylight daylight offset to the Date/Time value to make it a DateTimeZone value, which we'll name **DatetimeToDatetimezone**.
2. Slightly more complex function that pulls in all date anchor values to convert to an actual date. But it only lets single parameters to pass for each of the time anchor (which could be UTC or local time) and offset (standard or daylight saving), which we'll name **AnchorToDatetimezone**.
3. The complex function that applies the time zone to the Date/Time value, factoring in daylight saving and standard time observation by using the previous two functions, which we'll name **DatetimeAppendZone**.

Beginning with the simple **DatetimeToDatetimezone** custom function, which is meant to resolve consideration *c)*.

![Power Query create custom function Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/16.png?raw=true)

![Power Query create custom function Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/17.png?raw=true)

```
let
  DatetimeToDatetimezone = (DateTimestamp as datetime, Offset as nullable text) => 
    DateTimeZone.FromText(DateTime.ToText(DateTimestamp) & " " & Offset)
in
  DatetimeToDatetimezone
```

![Power Query create 1st custom function](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/18.png?raw=true)

Next we create the second custom function **AnchorToDatetimezone**, which takes in the dependent date/time value to get the year, and nullable parameters for time, offset, and the anchors for month, day, and *n*th occurrence of the day within the month. It checks the data structure to create the anchor's date, and appends the time and offset values passed into it.

* The first if condition checks that there are no incorrect nor incomplete data structures.
* The first else if condition creates the date time zone if there is a date anchor e.g. "21st" of given month.
* The second and third else if conditions convert to date time zones based on 1st, 2nd, 3rd, or 4th occurrence of specified day anchors, and are based on this previous [post](https://datamesse.github.io/blog/2021/01/16/power-bi-find-1st-2nd-3rd-specific-day-of-a-month.html).
* The fourth and fifth if else conditions convert based on the last occurrence of the specified day anchor, based on this [post](https://datamesse.github.io/blog/2021/01/30/power-bi-find-last-specific-day-of-a-month.html).

```
let
  AnchorToDatetimezone = (DateTimestamp as datetime, MonthAnchor as nullable number, DayAnchor as nullable number, PositionAnchor as nullable number, DateAnchor as nullable number, Time as nullable time, Offset as nullable text) => 
  /* Error-handling based on insufficient data or incorrect value combination */
  if (MonthAnchor = null) 
    or (DateAnchor = null and DayAnchor = null)
    or (DateAnchor <> null and DayAnchor <> null)
    or (DayAnchor <> null and PositionAnchor = null)
    or (DayAnchor = null and PositionAnchor <> null)
    or (Time = null)
    or (Offset = null)
  then "Incomplete data"
  /* Applying time zone to DateTimestamp, with separate conditions for position anchor = 9 i.e. "Last" */
  else if DateAnchor <> null
    then Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor)  & "/" & Text.From(DateAnchor) & " " & Text.From(Time) & Offset
  else if DayAnchor < 6 and PositionAnchor > 0 and PositionAnchor < 5
  /* Optional parameter in Date.DayOfWeek 1 = Day.Monday will get Sunday, hence DayAnchor (Sunday = 0) + 1 */
    then Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/" & Text.From( (7 - Date.DayOfWeek(Date.FromText(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1"), DayAnchor + 1)) + (-7 + (7 * PositionAnchor)) ) & " " & Text.From(Time) & Offset
  /* Need to pass Day.Sunday to get Saturday */
  else if DayAnchor = 6 and PositionAnchor > 0 and PositionAnchor < 5
    then Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/" & Text.From( (7 - Date.DayOfWeek(Date.FromText(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1"), Day.Sunday )) + (-7 + (7 * PositionAnchor)) ) & " " & Text.From(Time) & Offset
  /* handling for last specific day of month */
  else if DayAnchor = 0 and PositionAnchor = 9
    then Text.From(Date.AddDays(Date.EndOfMonth(Date.From(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1")),(-1 * Number.From(Date.DayOfWeek(Date.EndOfMonth(Date.From(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1")), Day.Sunday))))) & " " & Text.From(Time) & Offset
  else if DayAnchor > 0 and PositionAnchor = 9
    then Text.From(Date.AddDays(Date.EndOfMonth(Date.From(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1")),(-1 * (Number.From(Date.DayOfWeek(Date.EndOfMonth(Date.From(Text.From(Date.Year(DateTimestamp)) & "/" & Text.From(MonthAnchor) & "/1")), Day.Sunday)) + ( 7 - DayAnchor ))))) & " " & Text.From(Time) & Offset
  else null
in
  AnchorToDatetimezone
```

![Power Query create 2nd custom function](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/19.png?raw=true)

The third custom function **DatetimeAppendZone** uses the **AnchorToDatetimezone** custom function to create date/time anchors for the start and end of daylight savings, then compares them with the Date/Time value to determine if standard or daylight savings offsets should be suffixed to the Date/Time value, using the **DatetimeToDatetimezone** custom function.

Earlier in this post, I mentioned that Zendesk Explore's exports (and potentially other data sources) may be incorrectly failing to account for daylight savings differences. In this third custom function, you can use the "Difference" parameter to add/subtract the missed hour(s) to compensate for those. The code below does not do that, but the option is there.

```
let
  DatetimeAppendZone = (DateTimestamp as datetime, Difference as number, StandardOffset as nullable text, DaylightOffset as nullable text, DSTstartAncDate as nullable number, DSTstartAncPosition as nullable number, DSTstartAncDay as nullable number, DSTstartAncMonth as nullable number, DSTstartAncUTC as nullable time, DSTstartAncLocal as nullable time, DSTendAncDate as nullable number, DSTendAncPosition as nullable number, DSTendAncDay as nullable number, DSTendAncMonth as nullable number, DSTendAncUTC as nullable time, DSTendAncLocal as nullable time) => 
  /* Validation to ensure same time anchor types for start and end are used */
  if Difference <> 0 and ( (DSTstartAncLocal = null and DSTstartAncUTC = null) or (DSTendAncLocal = null and DSTendAncUTC = null) )
    then "Incomplete data"

  /* Where DST is not observed, just append Standard UTC offset */
  else if Difference = 0
    then DatetimeToDatetimezone(DateTimestamp, StandardOffset)

  /* From this point on, if using a data source that doesn't properly account for Daylight Savings offsets, you can factor those into the calculations */

  /* Where DST is observed with Standard time result */
  else if Difference <> 0
    and (
          (
           /* Where local offset is used, 1 DST period in same year, datetimestamp is outside daylight savings */
           DSTstartAncLocal <> null and DSTstartAncMonth < DSTendAncMonth
           and ( DatetimeToDatetimezone(DateTimestamp,StandardOffset) < DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncLocal, StandardOffset))
                or DatetimeToDatetimezone(DateTimestamp,StandardOffset) > DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncLocal, StandardOffset)) )
          )
      or  (
           /* Where local offset is used, 2 DST periods in same year, datetimestamp is outside both daylight savings periods */
           DSTstartAncLocal <> null and DSTstartAncMonth > DSTendAncMonth 
           and Date.Month(DateTimestamp) >= DSTendAncMonth and Date.Month(DateTimestamp) <= DSTstartAncMonth
           and DatetimeToDatetimezone(DateTimestamp,DaylightOffset) > DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncLocal, DaylightOffset))
           and DatetimeToDatetimezone(DateTimestamp,DaylightOffset) < DateTimeZone.From(AnchorToDatetimezone(Date.AddYears(DateTimestamp,1), DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncLocal, DaylightOffset))           
          )
      or  (
           /* Where UTC offset is used, 1 DST period in same year, datetimestamp is inside daylight savings */
           DSTstartAncUTC <> null and DSTstartAncMonth < DSTendAncMonth
           and ( DateTimeZone.ToUtc(DatetimeToDatetimezone(DateTimestamp,StandardOffset)) <  DateTimeZone.FromText(AnchorToDatetimezone(DateTimestamp, DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncUTC, "+00:00"))
                 or DateTimeZone.ToUtc(DatetimeToDatetimezone(DateTimestamp,StandardOffset)) > DateTimeZone.FromText(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncUTC, "+00:00")) )
          )
    )
    then DatetimeToDatetimezone(DateTimestamp, StandardOffset)

  /* Where DST is observed with Dayliht Saving time result */
  else if Difference <> 0
    and (
          (
           /* Where local offset is used, 1 DST period within same year, datetimestamp is inside daylight savings */    
           DSTstartAncLocal <> null and DSTstartAncMonth < DSTendAncMonth
           and ( DatetimeToDatetimezone(DateTimestamp,StandardOffset) >= DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncLocal, StandardOffset))
                or DatetimeToDatetimezone(DateTimestamp,StandardOffset) <= DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncLocal, StandardOffset)) )
          )
      or  (
           /* Where local offset is used, 2 DST periods in same year, datetimestamp is inside 1st daylight savings period */
           DSTstartAncLocal <> null and DSTstartAncMonth > DSTendAncMonth and Date.Month(DateTimestamp) <= DSTendAncMonth
           and DatetimeToDatetimezone(DateTimestamp,DaylightOffset) <= DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncLocal, DaylightOffset))
          )
      or  (
           /* Where local offset is used, 2 DST periods in same year, datetimestamp is inside 2nd daylight savings period */
           DSTstartAncLocal <> null and DSTstartAncMonth > DSTendAncMonth and Date.Month(DateTimestamp) >= DSTendAncMonth
           and DatetimeToDatetimezone(DateTimestamp,DaylightOffset) >= DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncLocal, DaylightOffset))
          )
      or  (
           /* Where UTC offset is used, 1 DST period in same year, datetimestamp is outside daylight savings */
           DSTstartAncUTC <> null and DSTstartAncMonth < DSTendAncMonth
           and DateTimeZone.ToUtc(DatetimeToDatetimezone(DateTimestamp,StandardOffset)) >=  DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTstartAncMonth, DSTstartAncDay, DSTstartAncPosition, DSTstartAncDate, DSTstartAncUTC, "+00:00"))
           and DateTimeZone.ToUtc(DatetimeToDatetimezone(DateTimestamp,StandardOffset)) <= DateTimeZone.From(AnchorToDatetimezone(DateTimestamp, DSTendAncMonth, DSTendAncDay, DSTendAncPosition, DSTendAncDate, DSTendAncUTC, "+00:00")) 
          )
    )
    then DatetimeToDatetimezone(DateTimestamp, DaylightOffset)
  else null
in
  DatetimeAppendZone
```

![Power Query create 3rd custom function](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/20.png?raw=true)

Now that our functions are complete, we can use the third **DatetimeAppendZone** to create the custom column which converts Date/Time to a datetimezone value, by passing in all the respective anchors as parameters.

```
DatetimeAppendZone([#"Date/Time"],[#"Daylight offset - Standard offset"],[Standard UTC offset],[Daylight Saving UTC offset],[#"DST start (date anchor)"],[#"DST start (position anchor)"],[#"DST start (day anchor)"],[#"DST start (month anchor)"],[#"DST start (UTC time anchor)"],[#"DST start (local time anchor)"],[#"DST end (date anchor)"],[#"DST end (position anchor)"],[#"DST end (day anchor)"],[#"DST end (month anchor)"],[#"DST end (UTC time anchor)"],[#"DST end (local time anchor)"])
```

![Power BI Create report](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/21.png?raw=true)

If we now create a table in the Power BI's report designer, we can see the appropriate suffixing of standard vs daylight saving offsets to our Date/Time values as we change the parameter. Then we can test to see if, regardless of the data structure used for the daylight savings anchoring, that the appropriate offset is applied to our Date/Time dataset.

Australia, Sydney is a time zone that uses local time and non-"last position" for its daylight savings start and end anchors.
![Power BI Sydney example Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/22a.png?raw=true)

![Power BI Sydney example Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/22.png?raw=true)

Europe, Dublin is a time zone that uses UTC time and "last position" (indicated by the 9), for its anchors.
![Power BI Dublin example Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/23a.png?raw=true)

![Power BI Dublin example Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/23.png?raw=true)

Africa, Casablanca is a time zone that uses a fixed date of the month for its anchors.
![Power BI Casablanca example Part A](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/24a.png?raw=true)

![Power BI Casablanca example Part B](https://github.com/datamesse/blog/blob/master/assets/images/blog/2021-02-06-allocate-timezone-dynamically-to-datetime-dataset/24.png?raw=true)

So now we have created a parameterised way of defining our data source's time zone, with potential to compensate for skipped daylight savings conversions it may have, and using the concept of anchor values to construct relative date/times.